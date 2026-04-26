namespace StudioBooking.Api.Models.Entities;

public enum BookingStatus { Pending, Confirmed, Cancelled, Completed }

public class Booking
{
    public int BookingId { get; set; }
    public int ClientId { get; set; }
    public int RoomId { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public decimal TotalPrice { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public DateTime CreatedAt { get; set; }
    public string? Note { get; set; }

    public Client Client { get; set; } = default!;
    public Room Room { get; set; } = default!;
    public ICollection<BookingEquipment> BookingEquipments { get; set; } = new List<BookingEquipment>();
}
