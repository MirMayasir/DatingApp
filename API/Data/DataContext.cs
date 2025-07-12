using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) 
            : base(options)
        { 
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if(!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server = LAPTOP-B3CO8FN5\\SQLEXPRESS;Database=DatingDatabase;Trusted_Connection = True;Encrypt=false");
                //optionsBuilder.UseMySQL("server=127.0.0.1; port=3306;uid=root;pwd=Mayasir@123;database=DatingDatabase");
            }
        }

        public virtual DbSet<AppUser> Users { get; set; }
        public virtual DbSet<UserLike> Likes { get; set; }

        public virtual DbSet<Message> Messages { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserLike>()
                .HasKey(k => new { k.SourceUserId, k.TargetUserId });


            modelBuilder.Entity<UserLike>()
                .HasOne(s=> s.SourceUser)
                .WithMany(l=>l.LikedUsers)
                .HasForeignKey(s=>s.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<UserLike>()
                .HasOne(t => t.TargetUser)
                .WithMany(l => l.LikedByUsers)
                .HasForeignKey(t => t.TargetUserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Message>()
                .HasOne(m=>m.Recipient)
                .WithMany(m=>m.MessageReceived)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany(m => m.MessageSent)
                .OnDelete(DeleteBehavior.Restrict);
        }

    }
}
