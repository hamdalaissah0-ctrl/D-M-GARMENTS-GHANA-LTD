// Provider-agnostic notification abstraction. Business logic (Edge Functions,
// DB triggers) only ever calls NotificationProvider.send*() — never a
// provider SDK directly — so swapping Arkesel/WhatsApp/email later never
// touches calling code. See spec §05.2.

export type NotificationResult =
  | { ok: true; providerMessageId?: string }
  | { ok: false; error: string }

export interface NotificationProvider {
  sendSMS(to: string, message: string): Promise<NotificationResult>
  sendWhatsApp(to: string, message: string): Promise<NotificationResult>
  sendEmail(
    to: string,
    subject: string,
    body: string
  ): Promise<NotificationResult>
}

class ArkeselSmsProvider {
  constructor(
    private apiKey: string,
    private senderId: string
  ) {}

  async sendSMS(to: string, message: string): Promise<NotificationResult> {
    try {
      const res = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
        method: "POST",
        headers: {
          "api-key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: this.senderId,
          message,
          recipients: [to],
        }),
      })

      const data = await res.json()

      if (!res.ok || data.status !== "success") {
        return {
          ok: false,
          error: data.message ?? `Arkesel responded with status ${res.status}`,
        }
      }

      return { ok: true, providerMessageId: data?.data?.[0]?.id }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) }
    }
  }
}

// WhatsApp automated sends are deferred — spec §05.1 architecture is Cloud
// API via a verified WABA, not yet connected. Staff use the manual wa.me
// deep-link flow (§21) in the meantime. This stub keeps the interface
// honest instead of silently no-op-succeeding.
class UnconfiguredWhatsAppProvider {
  async sendWhatsApp(_to: string, _message: string): Promise<NotificationResult> {
    return { ok: false, error: "WhatsApp Cloud API not yet configured" }
  }
}

// Email provider wired once a transactional email provider is chosen.
class UnconfiguredEmailProvider {
  async sendEmail(
    _to: string,
    _subject: string,
    _body: string
  ): Promise<NotificationResult> {
    return { ok: false, error: "Email provider not yet configured" }
  }
}

export function createNotificationProvider(): NotificationProvider {
  const arkeselKey = Deno.env.get("ARKESEL_API_KEY")
  const arkeselSender = Deno.env.get("ARKESEL_SENDER_ID") ?? "DM_Garments"
  const sms = arkeselKey
    ? new ArkeselSmsProvider(arkeselKey, arkeselSender)
    : null
  const whatsapp = new UnconfiguredWhatsAppProvider()
  const email = new UnconfiguredEmailProvider()

  return {
    sendSMS: (to, message) =>
      sms
        ? sms.sendSMS(to, message)
        : Promise.resolve({ ok: false, error: "ARKESEL_API_KEY not configured" }),
    sendWhatsApp: (to, message) => whatsapp.sendWhatsApp(to, message),
    sendEmail: (to, subject, body) => email.sendEmail(to, subject, body),
  }
}
