<?php

namespace App\Mail;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Contact $contact)
    {
        $this->queue = 'back_emails';
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Novo Contato Criado',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact_created',
        );
    }
}
