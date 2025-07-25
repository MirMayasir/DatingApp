﻿using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public void AddMessage(Message message)
        {
             _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Message> GetMessages(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _context.Messages
                .OrderByDescending(x => x.MessageSent)
                .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(x => x.RecipientUsername == messageParams.Username),
                "Outbox" => query.Where(x => x.SenderUsername == messageParams.Username),

                _ => query.Where(u => u.RecipientUsername == messageParams.Username && u.DateRed == null)

            };

            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber,
                messageParams.PageSize);
            
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUserName, string recipientUserName)
        {
            var messages = await _context.Messages
                 .Include(u => u.Sender).ThenInclude(p => p.Photos)
                 .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                 .Where(
                     m => m.RecipientUsername == currentUserName &&
                     m.SenderUsername == recipientUserName ||
                     m.RecipientUsername == recipientUserName &&
                     m.SenderUsername == currentUserName
                )
                 .OrderByDescending(m => m.MessageSent)
                 .ToListAsync();

            var unreadMessages = messages.Where(m => m.DateRed == null &&
            m.RecipientUsername==currentUserName).ToList();

            if (unreadMessages.Any())
            {
                foreach(var message in unreadMessages)
                {
                    message.DateRed = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
            }

            return _mapper.Map<IEnumerable<MessageDto>>(messages);

        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
