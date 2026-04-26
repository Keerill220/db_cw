namespace StudioBooking.Api.Models.Entities;

public class Studio
{
    public int StudioId { get; set; }
    public int AdminId { get; set; }
    public int CityId { get; set; }
    public string Name { get; set; } = default!;
    public string Address { get; set; } = default!;
    public string? Description { get; set; }
    public string? PhotoUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Administrator Admin { get; set; } = default!;
    public City City { get; set; } = default!;
    public ICollection<Room> Rooms { get; set; } = new List<Room>();
}
