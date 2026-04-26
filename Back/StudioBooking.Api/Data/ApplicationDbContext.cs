using Microsoft.EntityFrameworkCore;
using StudioBooking.Api.Data.Configurations;
using StudioBooking.Api.Models.Entities;

namespace StudioBooking.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<City> Cities => Set<City>();
    public DbSet<EquipmentType> EquipmentTypes => Set<EquipmentType>();
    public DbSet<Administrator> Administrators => Set<Administrator>();
    public DbSet<Studio> Studios => Set<Studio>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Equipment> Equipments => Set<Equipment>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<BookingEquipment> BookingEquipments => Set<BookingEquipment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new CityConfiguration());
        modelBuilder.ApplyConfiguration(new EquipmentTypeConfiguration());
        modelBuilder.ApplyConfiguration(new AdministratorConfiguration());
        modelBuilder.ApplyConfiguration(new StudioConfiguration());
        modelBuilder.ApplyConfiguration(new RoomConfiguration());
        modelBuilder.ApplyConfiguration(new ClientConfiguration());
        modelBuilder.ApplyConfiguration(new EquipmentConfiguration());
        modelBuilder.ApplyConfiguration(new BookingConfiguration());
        modelBuilder.ApplyConfiguration(new BookingEquipmentConfiguration());
    }
}
