using System.Net;
using System.Net.Mail;

namespace StudioBooking.Api.Services;

public interface IEmailService
{
    Task SendVerificationCodeAsync(string toEmail, string code, CancellationToken ct);
}

public class SmtpEmailService : IEmailService
{
    private readonly string _host;
    private readonly int _port;
    private readonly string? _username;
    private readonly string? _password;
    private readonly bool _enableSsl;
    private readonly string _fromEmail;
    private readonly string _fromName;

    public SmtpEmailService(IConfiguration config)
    {
        _host = config["Smtp:Host"] ?? throw new InvalidOperationException("Smtp:Host not configured.");
        _port = int.TryParse(config["Smtp:Port"], out var port) ? port : 587;
        _username = config["Smtp:Username"];
        _password = config["Smtp:Password"];
        _enableSsl = bool.TryParse(config["Smtp:EnableSsl"], out var enableSsl) ? enableSsl : true;
        _fromEmail = config["Smtp:FromEmail"] ?? throw new InvalidOperationException("Smtp:FromEmail not configured.");
        _fromName = config["Smtp:FromName"] ?? "SoundSpace";
    }

    public async Task SendVerificationCodeAsync(string toEmail, string code, CancellationToken ct)
    {
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

        using var mail = new MailMessage
        {
            From = new MailAddress(_fromEmail, _fromName),
            Subject = subject,
            Body = htmlContent,
            IsBodyHtml = true,
        };
        mail.To.Add(toEmail);
        mail.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(plainContent, null, "text/plain"));

        using var client = new SmtpClient(_host, _port)
        {
            EnableSsl = _enableSsl,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
        };

        if (!string.IsNullOrWhiteSpace(_username))
        {
            client.Credentials = new NetworkCredential(_username, _password);
        }

        using var registration = ct.Register(client.SendAsyncCancel);
        await client.SendMailAsync(mail, ct);
    }
}
