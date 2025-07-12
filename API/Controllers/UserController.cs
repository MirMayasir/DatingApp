using API.Data;
using API.DTOs;
using API.Entities;
using API.Extentions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoservice;

        public UserController(IUserRepository userRepository, IMapper mapper, IPhotoService photoservice)
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _photoservice = photoservice;
        }

        [HttpGet]

        public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var currentUser = await _userRepository.GetByNameAsync(User.GetUerName());
            userParams.CurrentUsername = currentUser.UserName;

            if(string.IsNullOrEmpty(currentUser.Gender))
            {
                userParams.Gender = currentUser.Gender == "male" ? "female" : " male";
            }

            var user = await _userRepository.GetMembersAsync(userParams);
            Response.AddPaginationHeaders(new PaginationHeaders(user.CurrentPage, user.PageSize,
                user.TotalCount, user.TotalPages));
      

            return Ok(user);
        }


        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetByUsername(string username)
        {
            
            return await _userRepository.GetMemberByUsernameAsync(username);
        }

        [HttpPut]

        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username = User.GetUerName();
            var user = await _userRepository.GetByNameAsync(username);
            if (user == null) return NotFound();

            _mapper.Map(memberUpdateDto, user);

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]

        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _userRepository.GetByNameAsync(User.GetUerName());
            if(user == null) return NotFound();

            var result = await _photoservice.AddPhotoAsync(file);
            if(result.Error != null) return BadRequest(result.Error.Message);
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
            };

            if(user.Photos.Count == 0) photo.IsMain = true;

            user.Photos.Add(photo);
            if (await _userRepository.SaveAllAsync())
            {
                return CreatedAtAction(nameof(GetByUsername),
                    new {username = user.UserName}, _mapper.Map<PhotoDto>(photo));
            }

            return BadRequest("problem adding photo");
        }

        [HttpPut("set-main-photo/{photoid}")]

        public async Task<ActionResult> setMainPgoto(int photoId)
        {
            var user = await _userRepository.GetByNameAsync(User.GetUerName());
            if(user == null) return NotFound();

            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if(photo == null) return NotFound();

            if (photo.IsMain) return BadRequest("this is already yor main photo");

            var currentPhoto = user.Photos.FirstOrDefault(x=> x.IsMain);
            if(currentPhoto != null) currentPhoto.IsMain = false;
            photo.IsMain = true;

            if(await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("problem setting the main photo");
        }


        [HttpDelete("delete-photo/{photoId}")]

        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _userRepository.GetByNameAsync(User.GetUerName());

            var photo = user.Photos.FirstOrDefault(x=> x.Id == photoId);
            if(photo == null) return NotFound();
            if (photo.IsMain) return BadRequest("cannot delete the main photo");

            if(photo.PublicId != null)
            {
                var result = await _photoservice.DeletePhotoAsync(photo.PublicId);
                if(result.Error != null) return BadRequest(result.Error.Message);
            }

            user.Photos.Remove(photo);

            if(await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("problem deleting the photo");
        }

       
    }
}
