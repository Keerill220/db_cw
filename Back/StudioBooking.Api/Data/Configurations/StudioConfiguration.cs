using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudioBooking.Api.Models.Entities;

namespace StudioBooking.Api.Data.Configurations;

public class StudioConfiguration : IEntityTypeConfiguration<Studio>
{
    public void Configure(EntityTypeBuilder<Studio> b)
    {
        b.ToTable("studios");
        b.HasKey(x => x.StudioId);
        b.Property(x => x.StudioId).HasColumnName("studio_id");
        b.Property(x => x.AdminId).HasColumnName("admin_id");
        b.Property(x => x.CityId).HasColumnName("city_id");
        b.Property(x => x.Name).HasColumnName("name").HasMaxLength(255).IsRequired();
        b.Property(x => x.Address).HasColumnName("address").HasMaxLength(255).IsRequired();
        b.Property(x => x.Description).HasColumnName("description");
        b.Property(x => x.PhotoUrl).HasColumnName("photo_url").HasMaxLength(500);
        b.Property(x => x.IsActive).HasColumnName("is_active").HasDefaultValue(true);
        b.Property(x => x.CreatedAt).HasColumnName("created_at");
        b.Property(x => x.UpdatedAt).HasColumnName("updated_at");

        b.HasOne(x => x.Admin)
            .WithMany(a => a.Studios)
            .HasForeignKey(x => x.AdminId)
            .OnDelete(DeleteBehavior.Restrict);

        b.HasOne(x => x.City)
            .WithMany(c => c.Studios)
            .HasForeignKey(x => x.CityId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
