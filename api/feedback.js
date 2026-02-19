
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_6aNaTVH9_BrxxGAAN6ZNvv152gi2cjV3n');

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, message } = request.body;

        const { data, error } = await resend.emails.send({
            from: 'MC Synapse Feedback <onboarding@resend.dev>',
            to: ['mcardux@gmail.com'], // Deliver to the user
            subject: `New Feedback from ${name}`,
            html: `
        <h1>New Feedback Received</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">
          ${message}
        </blockquote>
      `
        });

        if (error) {
            return response.status(400).json({ error });
        }

        return response.status(200).json({ message: 'Feedback sent successfully', data });
    } catch (err) {
        return response.status(500).json({ error: 'Internal Server Error' });
    }
}
