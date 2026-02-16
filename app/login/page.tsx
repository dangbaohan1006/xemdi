'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect if already logged in
        supabase.auth.getUser().then(({ data: { user } }: { data: { user: any } }) => {
            if (user) router.push('/');
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
            if (event === 'SIGNED_IN' && session) {
                router.push('/');
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black text-white tracking-tight">
                            Xem<span className="text-red-500">Đi</span>
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Chào mừng trở lại</h1>
                    <p className="text-zinc-400 mt-2">Đăng nhập để lưu lịch sử xem phim</p>
                </div>

                {/* Auth Form */}
                <div className="glass rounded-2xl p-6 animate-slide-up">
                    <Auth
                        supabaseClient={supabase}
                        appearance={{
                            theme: ThemeSupa,
                            variables: {
                                default: {
                                    colors: {
                                        brand: '#dc2626',
                                        brandAccent: '#b91c1c',
                                        inputBackground: '#18181b',
                                        inputText: '#fafafa',
                                        inputBorder: '#3f3f46',
                                        inputBorderFocus: '#dc2626',
                                        inputBorderHover: '#52525b',
                                        inputPlaceholder: '#71717a',
                                        messageText: '#fafafa',
                                        messageTextDanger: '#ef4444',
                                        anchorTextColor: '#dc2626',
                                        anchorTextHoverColor: '#ef4444',
                                    },
                                    borderWidths: {
                                        buttonBorderWidth: '0px',
                                        inputBorderWidth: '1px',
                                    },
                                    radii: {
                                        borderRadiusButton: '0.75rem',
                                        buttonBorderRadius: '0.75rem',
                                        inputBorderRadius: '0.75rem',
                                    },
                                    fontSizes: {
                                        baseInputSize: '14px',
                                        baseButtonSize: '14px',
                                    },
                                },
                            },
                            className: {
                                container: 'auth-container',
                                button: 'auth-button',
                                input: 'auth-input',
                            },
                        }}
                        providers={[]}
                        redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined}
                        localization={{
                            variables: {
                                sign_in: {
                                    email_label: 'Email',
                                    password_label: 'Mật khẩu',
                                    button_label: 'Đăng nhập',
                                    link_text: 'Đã có tài khoản? Đăng nhập',
                                },
                                sign_up: {
                                    email_label: 'Email',
                                    password_label: 'Mật khẩu',
                                    button_label: 'Đăng ký',
                                    link_text: 'Chưa có tài khoản? Đăng ký',
                                },
                            },
                        }}
                    />
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-zinc-600 mt-6">
                    Đăng nhập để lưu tiến trình và tiếp tục xem phim trên các thiết bị
                </p>
            </div>
        </div>
    );
}
