namespace StudioBooking.Api.Models.Entities;

public class Room
{
    public int RoomId { get; set; }
    public int StudioId { get; set; }
    public string Name { get; set; } = default!;
    public decimal AreaSqm { get; set; }
    public decimal PricePerHour { get; set; }
    public bool IsAvailable { get; set; } = true;
    public string? Description { get; set; }
    public string? PhotoUrl { get; set; }

    public Studio Studio { get; set; } = default!;
    public ICollection<Equipment> Equipments { get; set; } = new List<Equipment>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
