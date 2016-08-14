using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.SignalR;
using ChatSite.Models;
using System.Threading;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace ChatSite.Hubs
{
    public class ChatHub : Hub
    {
        private static readonly ConcurrentDictionary<string, User> Users = new ConcurrentDictionary<string, User>();

        public override Task OnConnected()
        {
            string connectionId = Context.ConnectionId;

            var user = Users.GetOrAdd( Context.ConnectionId, new User(connectionId, null) );

            Clients.Caller.sendUsers(Users.Values);

            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            string connectionId = Context.ConnectionId;

            User user;
            Users.TryGetValue(connectionId, out user);

            if (user != null)
            {
                User removedUser;
                Users.TryRemove(connectionId, out removedUser);

                if ( !string.IsNullOrEmpty(user.Username))
                    Clients.Others.userDisconnected(removedUser);
            }

            return base.OnDisconnected(stopCalled);
        }


        public void OnChatConnection(string username)
        {
            string connectionId = Context.ConnectionId;
            User user;
            var getUserResult = Users.TryGetValue(connectionId, out user);

            if (getUserResult)
            {
                user.Username = username;
            }

            Clients.All.userConnected(user);
        }

        public void BroadcastMessage(string message)
        {
            string connectionId = Context.ConnectionId;
            var user = Users.Values.SingleOrDefault(x => x.ConnectionString == connectionId);

            var messageToBroadcast = new Message
            {
                Content = message,
                Sender = user?.Username
            };

            Clients.All.broadcastMessage(messageToBroadcast);
        }

        public void CheckUsernameAvilability(string username)
        {
            var checkResult = Users.Values.SingleOrDefault(x => x.Username == username);
            var ifAvilable = checkResult == null ? true : false;
            Clients.Caller.checkUsernameAvilabilityResult(ifAvilable);
        } 
    }
}