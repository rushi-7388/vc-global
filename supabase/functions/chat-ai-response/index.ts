// import "https://deno.land/x/xhr@0.1.0/mod.ts";
// import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// import { createClient } from "https://deno.land/x/supabase_js@2.38.2/mod.ts";

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
// };

// serve(async (req) => {
//   // Handle CORS preflight requests
//   if (req.method === 'OPTIONS') {
//     return new Response(null, { headers: corsHeaders });
//   }

//   try {
//     const { userMessage } = await req.json();
    
//     if (!userMessage) {
//       throw new Error('User message is required');
//     }

//     console.log('Processing user message:', userMessage);

//     const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
//     if (!openAIApiKey) {
//       throw new Error('OpenAI API key not configured');
//     }

//     const supabaseUrl = Deno.env.get('SUPABASE_URL');
//     const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    
//     if (!supabaseUrl || !supabaseKey) {
//       throw new Error('Supabase configuration missing');
//     }

//     const supabase = createClient(supabaseUrl, supabaseKey);

//     // Call OpenAI API with the latest model
//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${openAIApiKey}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: 'gpt-4o-mini',
//         messages: [
//           { 
//             role: 'system', 
//             content: 'You are a helpful customer support assistant for V&C Global, a company that specializes in natural stones, marbles, and premium building materials. You should be friendly, professional, and helpful. Keep responses concise but informative. If users ask about products, services, or need help, provide relevant information about the company\'s offerings.'
//           },
//           { role: 'user', content: userMessage }
//         ],
//         temperature: 0.7,
//         max_tokens: 200,
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.text();
//       console.error('OpenAI API error:', errorData);
      
//       let aiResponse = "I'm sorry, I'm currently experiencing technical difficulties. Please try again later or contact our support team directly.";
      
//       // Handle specific error cases
//       if (response.status === 429) {
//         try {
//           const errorObj = JSON.parse(errorData);
//           if (errorObj.error?.code === 'insufficient_quota') {
//             aiResponse = "I apologize, but our AI service is temporarily unavailable due to quota limits. Please contact our support team directly at support@vcglobal.com for immediate assistance.";
//           } else {
//             aiResponse = "I'm currently experiencing high traffic. Please wait a moment and try again.";
//           }
//         } catch {
//           aiResponse = "I'm currently experiencing high traffic. Please wait a moment and try again.";
//         }
//       } else if (response.status === 401) {
//         aiResponse = "I'm sorry, there's an authentication issue with our AI service. Please contact our support team for assistance.";
//       }

//       // Store fallback response in database
//       const { error: insertError } = await supabase
//         .from('chat_messages')
//         .insert([{
//           message: aiResponse,
//           sender_name: 'AI Support',
//           sender_email: 'support@vcglobal.com',
//           is_admin: true
//         }]);

//       if (insertError) {
//         console.error('Error storing fallback response:', insertError);
//       }

//       return new Response(JSON.stringify({ 
//         success: true, 
//         response: aiResponse 
//       }), {
//         headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//       });
//     }

//     const data = await response.json();
//     const aiResponse = data.choices[0].message.content;

//     console.log('AI response generated:', aiResponse);

//     // Store AI response in database
//     const { error: insertError } = await supabase
//       .from('chat_messages')
//       .insert([{
//         message: aiResponse,
//         sender_name: 'AI Support',
//         sender_email: 'support@vcglobal.com',
//         is_admin: true
//       }]);

//     if (insertError) {
//       console.error('Error storing AI response:', insertError);
//       throw insertError;
//     }

//     console.log('AI response stored successfully');

//     return new Response(JSON.stringify({ 
//       success: true, 
//       response: aiResponse 
//     }), {
//       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//     });

//   } catch (error) {
//     console.error('Error in chat-ai-response function:', error);
    
//     // Store error response in database as fallback
//     try {
//       const supabaseUrl = Deno.env.get('SUPABASE_URL');
//       const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
      
//       if (supabaseUrl && supabaseKey) {
//         const supabase = createClient(supabaseUrl, supabaseKey);
//         await supabase
//           .from('chat_messages')
//           .insert([{
//             message: "I apologize, but I'm experiencing technical difficulties. Please contact our support team directly for assistance.",
//             sender_name: 'AI Support',
//             sender_email: 'support@vcglobal.com',
//             is_admin: true
//           }]);
//       }
//     } catch (fallbackError) {
//       console.error('Error storing fallback message:', fallbackError);
//     }

//     return new Response(JSON.stringify({ 
//       error: error.message 
//     }), {
//       status: 500,
//       headers: { ...corsHeaders, 'Content-Type': 'application/json' },
//     });
//   }
// });
