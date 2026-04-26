namespace StudioBooking.Api.Models.Entities;

public class Equipment
{
    public int EquipmentId { get; set; }
    public int RoomId { get; set; }
    public int TypeId { get; set; }
    public string Name { get; set; } = default!;
    public string? Condition { get; set; }
    public decimal PricePerHour { get; set; }

    public Room Room { get; set; } = default!;
    public EquipmentType EquipmentType { get; set; } = default!;
    public ICollection<BookingEquipment> BookingEquipments { get; set; } = new List<BookingEquipment>();
}
