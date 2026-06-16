import ProfileForm from "@/components/profile/ProfileForm"
import ManagementTab from "@/components/management/ManagementTab" // <-- Импортируем новый компонент
import { serverFetch } from "@/lib/fetch"
import { UserProfile } from "@/types/user/UserProfile"
import { redirect } from "next/navigation"
import { Bodoni_Moda } from "next/font/google"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

const bodoni = Bodoni_Moda({
    subsets: ["latin"],
    weight: "400",
})

export default async function ProfilePage() {
    const response = await serverFetch("/api/user/profile", {
        method: "GET",
    })

    if (response.status === 401) {
        redirect("/login")
    }

    if (!response.ok) {
        return (
            <div className="flex flex-col gap-6 md:px-24 md:py-12 py-6 px-4">
                <p className="text-center font-bold text-destructive">Failed to load profile</p>
            </div>
        )
    }

    const user: UserProfile = await response.json()

    return (
        <div className="flex flex-col gap-8 md:px-16 md:py-12 py-6 px-4 max-w-screen-2xl mx-auto">
            <div className="flex flex-col gap-2 text-center md:text-left">
                <h1 className={`text-4xl ${bodoni.className}`}>Settings</h1>
                <p className="text-muted-foreground">Manage your account and preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className={`grid w-full md:w-[400px] bg-muted/50 ${user.isAdmin ? "grid-cols-3" : "grid-cols-2"}`}>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="appointments" asChild>
                        <Link href="/appointments">Appointments</Link>
                    </TabsTrigger>
                    
                    {user.isAdmin && (
                        <TabsTrigger value="management">Management</TabsTrigger>
                    )}
                </TabsList>
                
                <TabsContent value="profile" className="mt-6">
                    <ProfileForm user={user} />
                </TabsContent>

                {user.isAdmin && (
                    <TabsContent value="management" className="mt-6">
                        <ManagementTab />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}