using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudioBooking.Api.Models.Entities;

namespace StudioBooking.Api.Data.Configurations;

public class BookingEquipmentConfiguration : IEntityTypeConfiguration<BookingEquipment>
{
    public void Configure(EntityTypeBuilder<BookingEquipment> b)
    {
        b.ToTable("booking_equipment");
        b.HasKey(x => x.BookingEquipmentId);
        b.Property(x => x.BookingEquipmentId).HasColumnName("booking_equipment_id");
        b.Property(x => x.BookingId).HasColumnName("booking_id");
        b.Property(x => x.EquipmentId).HasColumnName("equipment_id");
        b.Property(x => x.PriceSnapshot).HasColumnName("price_snapshot").HasColumnType("decimal(10,2)");

        b.HasOne(x => x.Booking)
            .WithMany(bk => bk.BookingEquipments)
            .HasForeignKey(x => x.BookingId)
            .OnDelete(DeleteBehavior.Cascade);

        b.HasOne(x => x.Equipment)
            .WithMany(e => e.BookingEquipments)
            .HasForeignKey(x => x.EquipmentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
