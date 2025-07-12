using API.DTOs;
using API.Entities;
using API.Extentions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<AppUser, MemberDto>()
                .ForMember(dest => dest.Age , opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()))
                .ForMember(dest => dest.PhotoUrl, opt=> opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url));
                ;
            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();
            CreateMap<RegisterDto, AppUser>();
            CreateMap<Message, MessageDto>()
                .ForMember(u=> u.SenderPhotoUrl, o=> o.MapFrom(s=> s.Sender.Photos.
                FirstOrDefault(p=> p.IsMain).Url))
                .ForMember(u=>u.RecipientPhotoUrl, o=>o.MapFrom(s=>s.Recipient.Photos.
                FirstOrDefault(p=>p.IsMain).Url));
        }
    }
}
