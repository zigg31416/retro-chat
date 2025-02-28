import { createClient } from '@supabase/supabase-js';

// Replace with your own Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to create a new room
export const createRoom = async (roomName, hostName) => {
  try {
    // Generate a temporary user ID
    const hostId = crypto.randomUUID();
    
    // Call the Supabase function to create a room with random code
    const { data, error } = await supabase.rpc('create_room', { 
      p_room_name: roomName,
      p_host_name: hostName,
      p_host_id: hostId
    });
    
    if (error) throw error;
    
    return { roomCode: data.room_code, hostId };
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

// Function to join a room
export const joinRoom = async (roomCode, username) => {
  try {
    const userId = crypto.randomUUID();
    
    // Create a join request
    const { error } = await supabase
      .from('join_requests')
      .insert([
        { room_code: roomCode, user_id: userId, username }
      ]);
    
    if (error) throw error;
    
    return { userId, username };
  } catch (error) {
    console.error('Error joining room:', error);
    throw error;
  }
};

// Function to accept a join request
export const acceptJoinRequest = async (requestId) => {
  try {
    // Get the request details
    const { data: request, error: requestError } = await supabase
      .from('join_requests')
      .select('*')
      .eq('id', requestId)
      .single();
    
    if (requestError) throw requestError;
    
    // Update request status
    const { error: updateError } = await supabase
      .from('join_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId);
    
    if (updateError) throw updateError;
    
    // Add user to room_users
    const { error: insertError } = await supabase
      .from('room_users')
      .insert([{
        room_code: request.room_code,
        user_id: request.user_id,
        username: request.username
      }]);
    
    if (insertError) throw insertError;
    
    return true;
  } catch (error) {
    console.error('Error accepting join request:', error);
    throw error;
  }
};

// Function to send a message
export const sendMessage = async (roomCode, userId, username, message) => {
  try {
    const { error } = await supabase
      .from('messages')
      .insert([
        { room_code: roomCode, user_id: userId, username, message }
      ]);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Function to leave a room
export const leaveRoom = async (roomCode, userId) => {
  try {
    const { error } = await supabase
      .from('room_users')
      .update({ status: 'left' })
      .eq('room_code', roomCode)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error leaving room:', error);
    throw error;
  }
};

// Function to subscribe to new messages
export const subscribeToMessages = (roomCode, callback) => {
  return supabase
    .channel(`messages:${roomCode}`)
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_code=eq.${roomCode}` }, 
      (payload) => callback(payload.new)
    )
    .subscribe();
};

// Function to subscribe to join requests
export const subscribeToJoinRequests = (roomCode, callback) => {
  return supabase
    .channel(`join_requests:${roomCode}`)
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'join_requests', filter: `room_code=eq.${roomCode}` }, 
      (payload) => callback(payload.new)
    )
    .subscribe();
};

// Function to subscribe to user status changes
export const subscribeToUserStatus = (roomCode, callback) => {
  return supabase
    .channel(`room_users:${roomCode}`)
    .on('postgres_changes', 
      { event: 'UPDATE', schema: 'public', table: 'room_users', filter: `room_code=eq.${roomCode}` }, 
      (payload) => callback(payload.new)
    )
    .subscribe();
};
