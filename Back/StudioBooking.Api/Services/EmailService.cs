using SendGrid;
using SendGrid.Helpers.Mail;

namespace StudioBooking.Api.Services;

public interface IEmailService
{
    Task SendVerificationCodeAsync(string toEmail, string code, CancellationToken ct);
}

public class SendGridEmailService : IEmailService
{
    private readonly string _apiKey;
    private readonly string _fromEmail;
    private readonly string _fromName;

    public SendGridEmailService(IConfiguration config)
    {
        _apiKey = config["SendGrid:ApiKey"] ?? throw new InvalidOperationException("SendGrid:ApiKey not configured.");
        _fromEmail = config["SendGrid:FromEmail"] ?? "noreply@studiobooking.com";
        _fromName = config["SendGrid:FromName"] ?? "SoundSpace";
    }

    public async Task SendVerificationCodeAsync(string toEmail, string code, CancellationToken ct)
    {
        var client = new SendGridClient(_apiKey);
        var from = new EmailAddress(_fromEmail, _fromName);
        var to = new EmailAddress(toEmail);
        const string subject = "Код підтвердження SoundSpace";
        var plainContent = $"Ваш код підтвердження: {code}\n\nКод дійсний протягом 10 хвилин.";
        var htmlContent = $@"
            <div style='font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;'>
              <h2 style='color:#0d9488'>Підтвердіть ваш email</h2>
              <p>Ваш код підтвердження для SoundSpace:</p>
              <div style='font-size:36px;font-weight:bold;letter-spacing:8px;color:#0d9488;margin:24px 0;text-align:center'>{code}</div>
              <p style='color:#666'>Цей код дійсний протягом <strong>10 хвилин</strong>.</p>
              <p style='color:#999;font-size:12px'>Якщо ви не реєструвались у SoundSpace, проігноруйте цей лист.</p>
            </div>";

        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainContent, htmlContent);
        var response = await client.SendEmailAsync(msg, ct);
        if ((int)response.StatusCode >= 400)
        {
            var body = await response.Body.ReadAsStringAsync(ct);
            throw new InvalidOperationException($"SendGrid returned {response.StatusCode}: {body}");
        }
    }
}
