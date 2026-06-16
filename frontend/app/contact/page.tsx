export default function ContactPage() {
    return (
        <div className="container mx-auto px-8 max-w-3xl min-h-[50vh]">
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground mb-8">
                We'd love to hear from you. Please reach out to us using the contact details below.
            </p>

            <div className="flex flex-col gap-4 bg-card border rounded-2xl p-6">
                <div>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-1">Phone</h2>
                    <p className="text-lg font-medium">+44 20 7123 4567</p>
                </div>

                <div className="h-px bg-border w-full" />

                <div>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-1">Email</h2>
                    <p className="text-lg font-medium">hello@snip-it.example.com</p>
                </div>

                <div className="h-px bg-border w-full" />

                <div>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-1">Address</h2>
                    <p className="text-lg font-medium">
                        14 Pont Street<br />
                        London SW1X 9EL<br />
                        United Kingdom
                    </p>
                </div>

                <div className="h-px bg-border w-full" />

                <div>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-1">Opening Hours</h2>
                    <div className="flex flex-col gap-1 text-base font-medium">
                        <div className="flex justify-between max-w-xs">
                            <span>Monday - Friday</span>
                            <span>8:00 AM - 8:00 PM</span>
                        </div>
                        <div className="flex justify-between max-w-xs">
                            <span>Saturday - Sunday</span>
                            <span>Closed</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
