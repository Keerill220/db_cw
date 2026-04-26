using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudioBooking.Api.Models.Entities;

namespace StudioBooking.Api.Data.Configurations;

public class BookingConfiguration : IEntityTypeConfiguration<Booking>
{
    public void Configure(EntityTypeBuilder<Booking> b)
    {
        b.ToTable("bookings");
        b.HasKey(x => x.BookingId);
        b.Property(x => x.BookingId).HasColumnName("booking_id");
        b.Property(x => x.ClientId).HasColumnName("client_id");
        b.Property(x => x.RoomId).HasColumnName("room_id");
        b.Property(x => x.Date).HasColumnName("date");
        b.Property(x => x.StartTime).HasColumnName("start_time");
        b.Property(x => x.EndTime).HasColumnName("end_time");
        b.Property(x => x.TotalPrice).HasColumnName("total_price").HasColumnType("decimal(10,2)");
        b.Property(x => x.Status).HasColumnName("status")
            .HasConversion<string>()
            .HasMaxLength(20);
        b.Property(x => x.CreatedAt).HasColumnName("created_at");
        b.Property(x => x.Note).HasColumnName("note");

        b.HasOne(x => x.Client)
            .WithMany(c => c.Bookings)
            .HasForeignKey(x => x.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        b.HasOne(x => x.Room)
            .WithMany(r => r.Bookings)
            .HasForeignKey(x => x.RoomId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
