using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudioBooking.Api.Models.Entities;

namespace StudioBooking.Api.Data.Configurations;

public class AdministratorConfiguration : IEntityTypeConfiguration<Administrator>
{
    public void Configure(EntityTypeBuilder<Administrator> b)
    {
        b.ToTable("administrators");
        b.HasKey(x => x.AdminId);
        b.Property(x => x.AdminId).HasColumnName("admin_id");
        b.Property(x => x.Email).HasColumnName("email").HasMaxLength(255).IsRequired();
        b.Property(x => x.PasswordHash).HasColumnName("password_hash").HasMaxLength(255).IsRequired();
        b.Property(x => x.FirstName).HasColumnName("first_name").HasMaxLength(100).IsRequired();
        b.Property(x => x.LastName).HasColumnName("last_name").HasMaxLength(100).IsRequired();
        b.Property(x => x.Phone).HasColumnName("phone").HasMaxLength(20);
        b.Property(x => x.Role).HasColumnName("role")
            .HasConversion<string>()
            .HasMaxLength(20)
            .IsRequired();
        b.Property(x => x.CreatedAt).HasColumnName("created_at");
        b.Property(x => x.UpdatedAt).HasColumnName("updated_at");
        b.HasIndex(x => x.Email).IsUnique();
    }
}
