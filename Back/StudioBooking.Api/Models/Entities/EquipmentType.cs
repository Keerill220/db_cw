namespace StudioBooking.Api.Models.Entities;

public class EquipmentType
{
    public int TypeId { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }

    public ICollection<Equipment> Equipments { get; set; } = new List<Equipment>();
}
