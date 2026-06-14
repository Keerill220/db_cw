namespace StudioBooking.Api.Models;

public class PendingRegistration
{
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string? Phone { get; set; }
    public string Code { get; set; } = "";
    public DateTime ExpiresAt { get; set; }
}
