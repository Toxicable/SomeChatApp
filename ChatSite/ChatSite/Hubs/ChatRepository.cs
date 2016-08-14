using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;

namespace ChatSite.Hubs
{

    public sealed class ChatRepository
    {
        private static readonly Lazy<ChatRepository> lazy =
            new Lazy<ChatRepository>(() => new ChatRepository());

        public static ChatRepository Instance { get { return lazy.Value; } }

        private ChatRepository()
        {
        }

        public List<User> Users = new List<User>();
        //public Timer CheckUsernamesTimer = new Timer(ChatHub.CheckUsernames, null, 0, 1000 * 5);
    }

    public class User
    {
        public User(string connectionString, string username)
        {
            ConnectionString = connectionString;
            Username = username;
            IsCheckingStatus = false;
        }
        public bool IsCheckingStatus { get; set; }
        public string ConnectionString { get; set; }
        public string Username { get; set; }
    }
    
}