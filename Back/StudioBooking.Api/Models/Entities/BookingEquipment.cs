namespace StudioBooking.Api.Models.Entities;

public class BookingEquipment
{
    public int BookingEquipmentId { get; set; }
    public int BookingId { get; set; }
    public int EquipmentId { get; set; }
    public decimal PriceSnapshot { get; set; }

    public Booking Booking { get; set; } = default!;
    public Equipment Equipment { get; set; } = default!;
}
