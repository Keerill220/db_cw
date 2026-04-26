using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudioBooking.Api.Models.Entities;

namespace StudioBooking.Api.Data.Configurations;

public class EquipmentConfiguration : IEntityTypeConfiguration<Equipment>
{
    public void Configure(EntityTypeBuilder<Equipment> b)
    {
        b.ToTable("equipment");
        b.HasKey(x => x.EquipmentId);
        b.Property(x => x.EquipmentId).HasColumnName("equipment_id");
        b.Property(x => x.RoomId).HasColumnName("room_id");
        b.Property(x => x.TypeId).HasColumnName("type_id");
        b.Property(x => x.Name).HasColumnName("name").HasMaxLength(255).IsRequired();
        b.Property(x => x.Condition).HasColumnName("condition").HasMaxLength(50);
        b.Property(x => x.PricePerHour).HasColumnName("price_per_hour").HasColumnType("decimal(10,2)");

        b.HasOne(x => x.Room)
            .WithMany(r => r.Equipments)
            .HasForeignKey(x => x.RoomId)
            .OnDelete(DeleteBehavior.Cascade);

        b.HasOne(x => x.EquipmentType)
            .WithMany(et => et.Equipments)
            .HasForeignKey(x => x.TypeId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
