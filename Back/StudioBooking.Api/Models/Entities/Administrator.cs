namespace StudioBooking.Api.Models.Entities;

public enum AdminRole { Owner, Superadmin }

public class Administrator
{
    public int AdminId { get; set; }
    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string? Phone { get; set; }
    public AdminRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<Studio> Studios { get; set; } = new List<Studio>();
}
