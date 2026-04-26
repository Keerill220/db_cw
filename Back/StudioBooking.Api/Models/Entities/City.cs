namespace StudioBooking.Api.Models.Entities;

public class City
{
    public int CityId { get; set; }
    public string Name { get; set; } = default!;
    public string Country { get; set; } = default!;

    public ICollection<Studio> Studios { get; set; } = new List<Studio>();
}
