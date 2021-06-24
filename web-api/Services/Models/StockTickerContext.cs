using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace Services.Models
{
    public partial class StockTickerContext : DbContext
    {
        public StockTickerContext()
        {
        }

        public StockTickerContext(DbContextOptions<StockTickerContext> options)
            : base(options)
        {
        }

        public virtual DbSet<StockPriceHistory> StockPriceHistories { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseMySql("server=localhost;port=3306;database=StockTicker;uid=hung;password=dsa", Microsoft.EntityFrameworkCore.ServerVersion.Parse("10.3.29-mariadb"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasCharSet("utf8mb4")
                .UseCollation("utf8mb4_unicode_ci");

            modelBuilder.Entity<StockPriceHistory>(entity =>
            {
                entity.HasKey(e => new { e.StockCode, e.Date })
                    .HasName("PRIMARY")
                    .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                entity.ToTable("StockPriceHistory");

                entity.Property(e => e.StockCode)
                    .HasMaxLength(10)
                    .IsFixedLength(true);

                entity.Property(e => e.Date).HasColumnType("date");

                entity.Property(e => e.ClosePrice)
                    .HasPrecision(15, 4)
                    .HasDefaultValueSql("-1.0000");

                entity.Property(e => e.HighPrice)
                    .HasPrecision(15, 4)
                    .HasDefaultValueSql("-1.0000");

                entity.Property(e => e.LowPrice)
                    .HasPrecision(15, 4)
                    .HasDefaultValueSql("-1.0000");

                entity.Property(e => e.OpenPrice)
                    .HasPrecision(15, 4)
                    .HasDefaultValueSql("-1.0000");

                entity.Property(e => e.Volume)
                    .HasColumnType("bigint(20)")
                    .HasDefaultValueSql("-1");

                entity.Property(e => e.VolumeForeignBuy)
                    .HasColumnType("bigint(20)")
                    .HasDefaultValueSql("-1");

                entity.Property(e => e.VolumeForeignSell)
                    .HasColumnType("bigint(20)")
                    .HasDefaultValueSql("-1");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
