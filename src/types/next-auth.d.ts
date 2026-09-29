import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      whatsapp: string | null;
      username: string;
      avatar: string | null;
      isVerified: boolean;
      isAdmin: boolean;
    };
  }

  interface User {
    id: string;
    username: string;
    avatar: string | null;
    isVerified: boolean;
    isAdmin: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    avatar?: string | null;
    isVerified?: boolean;
    isAdmin?: boolean;
  }
}
