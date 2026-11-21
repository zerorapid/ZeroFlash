import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import {
  LogIn,
  UserPlus,
  ShieldCheck,
  Zap,
  Eye,
  EyeOff,
  Building2,
  Mail,
  Lock,
  User,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
  onSignIn: (email: string, name?: string, org?: string) => void;
  onSignUp: (name: string, email: string, org: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'signin',
  onSignIn,
  onSignUp,
}) => {
  const [tab, setTab] = useState<'signin' | 'signup'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);

  // Sign In Form State
  const [signInEmail, setSignInEmail] = useState('hello@jayapalreddy.in');
  const [signInPassword, setSignInPassword] = useState('••••••••••••');

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpOrg, setSignUpOrg] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail) return;
    onSignIn(signInEmail);
    onClose();
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpEmail || !signUpName) return;
    onSignUp(signUpName, signUpEmail, signUpOrg || 'Studio Design Lab');
    onClose();
  };

  const handleDemoSignIn = () => {
    onSignIn('hello@jayapalreddy.in', 'Jayapal Reddy', 'Zerorapid Studios');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md bg-white p-0 overflow-hidden rounded-2xl border border-zinc-200 shadow-2xl">
        <DialogHeader className="p-5 border-b border-zinc-100 bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-sm font-bold text-zinc-950">
                  ZeroFlash Studio Account
                </DialogTitle>
                <Badge variant="outline" className="text-[10px] bg-zinc-100 text-zinc-700 border-zinc-200">
                  Local-First
                </Badge>
              </div>
              <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                Sign in to sync brand decks, MCP tokens & agency standards.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-5">
          <Tabs value={tab} onValueChange={v => setTab(v as any)} className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-9 bg-zinc-100 p-0.5 rounded-lg mb-4">
              <TabsTrigger value="signin" className="text-xs font-semibold gap-1.5">
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-xs font-semibold gap-1.5">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: SIGN IN */}
            <TabsContent value="signin" className="space-y-4 focus-visible:outline-none">
              <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Work Email</span>
                  </label>
                  <Input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={e => setSignInEmail(e.target.value)}
                    placeholder="name@agency.com"
                    className="h-9 text-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-semibold text-zinc-700 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Password</span>
                    </label>
                    <span className="text-[10px] text-zinc-400 font-mono">Any password for demo</span>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signInPassword}
                      onChange={e => setSignInPassword(e.target.value)}
                      className="h-9 text-xs pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-9 bg-zinc-950 text-white hover:bg-zinc-900 text-xs font-bold gap-1.5 mt-2"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In to Studio</span>
                </Button>
              </form>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-zinc-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                  <span className="bg-white px-2 text-zinc-400">or 1-click sovereign access</span>
                </div>
              </div>

              {/* Quick Demo Access Button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleDemoSignIn}
                className="w-full h-9 border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 text-xs font-semibold text-zinc-800 gap-2 justify-center"
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-[9px] font-black">
                  JR
                </div>
                <span>Continue as Jayapal Reddy (Zerorapid Pro)</span>
                <Sparkles className="w-3 h-3 text-amber-500 ml-auto" />
              </Button>
            </TabsContent>

            {/* TAB 2: CREATE ACCOUNT */}
            <TabsContent value="signup" className="space-y-3.5 focus-visible:outline-none">
              <form onSubmit={handleSignUpSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Your Full Name</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={signUpName}
                    onChange={e => setSignUpName(e.target.value)}
                    placeholder="e.g. Alex Vance"
                    className="h-9 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Work Email</span>
                  </label>
                  <Input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={e => setSignUpEmail(e.target.value)}
                    placeholder="alex@vancedesign.io"
                    className="h-9 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Agency / Brand Organization</span>
                  </label>
                  <Input
                    type="text"
                    value={signUpOrg}
                    onChange={e => setSignUpOrg(e.target.value)}
                    placeholder="e.g. Vance Modern Systems"
                    className="h-9 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Create Password</span>
                  </label>
                  <Input
                    type="password"
                    required
                    value={signUpPassword}
                    onChange={e => setSignUpPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="h-9 text-xs"
                  />
                </div>

                <div className="pt-1">
                  <Button
                    type="submit"
                    className="w-full h-9 bg-zinc-950 text-white hover:bg-zinc-900 text-xs font-bold gap-1.5"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Free Studio Account</span>
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Client-side encrypted
            </span>
            <span className="font-mono text-[10px]">ZeroFlash Sovereign v2.0</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
