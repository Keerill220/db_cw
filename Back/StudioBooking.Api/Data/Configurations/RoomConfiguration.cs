using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudioBooking.Api.Models.Entities;

namespace StudioBooking.Api.Data.Configurations;

public class RoomConfiguration : IEntityTypeConfiguration<Room>
{
    public void Configure(EntityTypeBuilder<Room> b)
    {
        b.ToTable("rooms");
        b.HasKey(x => x.RoomId);
        b.Property(x => x.RoomId).HasColumnName("room_id");
        b.Property(x => x.StudioId).HasColumnName("studio_id");
        b.Property(x => x.Name).HasColumnName("name").HasMaxLength(255).IsRequired();
        b.Property(x => x.AreaSqm).HasColumnName("area_sqm").HasColumnType("decimal(6,2)");
        b.Property(x => x.PricePerHour).HasColumnName("price_per_hour").HasColumnType("decimal(10,2)");
        b.Property(x => x.IsAvailable).HasColumnName("is_available").HasDefaultValue(true);
        b.Property(x => x.Description).HasColumnName("description");
        b.Property(x => x.PhotoUrl).HasColumnName("photo_url").HasMaxLength(500);

        b.HasOne(x => x.Studio)
            .WithMany(s => s.Rooms)
            .HasForeignKey(x => x.StudioId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
