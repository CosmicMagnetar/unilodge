import React, { useState, FormEvent } from 'react';
import { Icons } from './Icons.tsx';
import { Button, Input, Card } from './ui.tsx';

export type LoginPageProps = { 
    onLogin: (email: string, password: string) => Promise<void>; 
    onSignup: (name: string, email: string, password: string) => Promise<void>; 
};

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isSignup) {
                await onSignup(name, email, password);
            } else {
                await onLogin(email, password);
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center py-12 px-4">
            <Card className="p-8 md:p-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <Icons.building className="h-14 w-14 text-blue-800 mx-auto" />
                    <h2 className="text-3xl font-bold text-dark-text mt-4">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
                    <p className="text-gray-600 mt-1">{isSignup ? 'Sign up to get started' : 'Login to manage your stay.'}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {isSignup && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                        {!isSignup && (
                            <p className="text-xs text-gray-500 mt-1">Demo: admin@campus.edu / admin123</p>
                        )}
                    </div>
                    {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}
                    <Button type="submit" disabled={loading} className="w-full !py-3 header-primary">
                        {loading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Login')}
                    </Button>
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => { setIsSignup(!isSignup); setError(''); }}
                            className="text-sm text-blue-700 hover:underline"
                        >
                            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};