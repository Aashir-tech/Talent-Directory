import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTalent } from '../redux/thunks/talentsThunks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Mail, Briefcase, Award, Trash2, Calendar, Edit, Shield, Clock, TrendingUp } from 'lucide-react';

const TalentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { talents, loading } = useSelector((state) => state.talents);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const talent = talents.find((t) => t._id === id);

  useEffect(() => {
    if (!talent && !loading) {
      navigate('/');
    }
  }, [talent, loading, navigate]);

  const handleDelete = async () => {
    await dispatch(deleteTalent(id));
    navigate('/');
  };

  if (!talent) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-12 w-12 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading talent details...</p>
          </div>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getExperienceLevel = (exp) => {
    if (exp <= 2) return { 
      label: 'Junior Developer', 
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700',
      icon: '🌱'
    };
    if (exp <= 5) return { 
      label: 'Mid-level Developer', 
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700',
      icon: '🚀'
    };
    if (exp <= 10) return { 
      label: 'Senior Developer', 
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700',
      icon: '⭐'
    };
    return { 
      label: 'Expert/Lead', 
      color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700',
      icon: '👑'
    };
  };

  const expLevel = getExperienceLevel(talent.experience);

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Back Button */}
      <Link to="/">
        <Button 
          variant="ghost" 
          className="mb-6 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Header Card with Gradient */}
      <Card className="shadow-2xl dark:shadow-slate-900/50 mb-8 overflow-hidden border-2 dark:border-slate-700 backdrop-blur pt-0">
        {/* Gradient Header */}
        <div className="relative bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 h-40">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
          </div>
        </div>
        
        <CardContent className="pt-0 dark:bg-slate-800">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6 -mt-15 pb-6">
            {/* Avatar with Glow Effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-indigo-500 rounded-full blur-xl opacity-50 dark:opacity-30"></div>
              <Avatar className="relative h-36 w-36 border-4 border-white dark:border-slate-800 shadow-2xl ring-4 ring-blue-500/20 dark:ring-blue-400/20">
                <AvatarFallback className="text-4xl font-bold bg-linear-to-br from-blue-500 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-500 dark:to-purple-500 text-white">
                  {getInitials(talent.name)}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name, Email and Level Badge */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">
                  {talent.name}
                </h1>
                <Badge className={`${expLevel.color} text-sm px-3 py-1 font-semibold border dark:border`}>
                  {expLevel.icon} {expLevel.label}
                </Badge>
              </div>
              <div className="flex items-center text-slate-600 dark:text-slate-400 mb-3">
                <Mail className="h-4 w-4 mr-2" />
                <a 
                  href={`mailto:${talent.email}`} 
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
                >
                  {talent.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                <span>Added on {formatDate(talent.createdAt)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 lg:mb-4">
              <Link to={`/edit-talent/${talent._id}`}>
                <Button 
                  variant="outline" 
                  className="shadow-lg hover:shadow-xl dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600 dark:hover:border-slate-500 transition-all"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Talent
                </Button>
              </Link>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="shadow-lg hover:shadow-xl text-slate-900 dark:text-white cursor-pointer dark:bg-red-900/80 dark:hover:bg-red-900 transition-all"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Experience Card */}
        <Card className="shadow-xl dark:shadow-slate-900/50 hover:shadow-2xl dark:hover:shadow-slate-900/70 transition-all duration-300 border-l-4 border-l-blue-500 dark:border-l-blue-400 dark:bg-slate-800 dark:border-slate-700 group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-slate-700 dark:text-slate-200">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <Briefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span>Experience</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
              {talent.experience}
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              {talent.experience === 1 ? 'Year' : 'Years'} of experience
            </p>
          </CardContent>
        </Card>

        {/* Total Skills Card */}
        <Card className="shadow-xl dark:shadow-slate-900/50 hover:shadow-2xl dark:hover:shadow-slate-900/70 transition-all duration-300 border-l-4 border-l-purple-500 dark:border-l-purple-400 dark:bg-slate-800 dark:border-slate-700 group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-slate-700 dark:text-slate-200">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <span>Skills</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
              {talent.skills.length}
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Technical {talent.skills.length === 1 ? 'skill' : 'skills'}
            </p>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="shadow-xl dark:shadow-slate-900/50 hover:shadow-2xl dark:hover:shadow-slate-900/70 transition-all duration-300 border-l-4 border-l-emerald-500 dark:border-l-emerald-400 dark:bg-slate-800 dark:border-slate-700 group">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-slate-700 dark:text-slate-200">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg group-hover:scale-110 transition-transform">
                <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-linear-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 text-white px-4 py-2 text-lg font-semibold shadow-lg mb-2">
              ● Active
            </Badge>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              Profile is active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Skills Card */}
      <Card className="shadow-xl dark:shadow-slate-900/50 hover:shadow-2xl dark:hover:shadow-slate-900/70 transition-all duration-300 mb-8 dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="border-b dark:border-slate-700 bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-3 text-2xl dark:text-slate-100">
                <div className="p-2 bg-linear-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-lg shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <span>Skills & Expertise</span>
              </CardTitle>
              <CardDescription className="mt-2 dark:text-slate-400">
                Technical skills and areas of expertise
              </CardDescription>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500 dark:text-purple-400 opacity-50" />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            {talent.skills.map((skill, index) => (
              <Badge
                key={index}
                className="text-base px-5 py-2.5 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-500 dark:via-indigo-500 dark:to-purple-500 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:via-indigo-600 dark:hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 cursor-default"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Info Card */}
      <Card className="shadow-xl dark:shadow-slate-900/50 hover:shadow-2xl dark:hover:shadow-slate-900/70 transition-all duration-300 dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="border-b dark:border-slate-700 bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
          <CardTitle className="text-2xl dark:text-slate-100">Additional Information</CardTitle>
          <CardDescription className="dark:text-slate-400">
            System and profile metadata
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Profile ID
            </p>
            <div className="flex items-center gap-2">
              <p className="text-slate-800 dark:text-slate-200 font-mono text-sm bg-slate-100 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex-1">
                {talent._id}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(talent._id)}
                className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600"
              >
                Copy
              </Button>
            </div>
          </div>
          
          <Separator className="dark:bg-slate-700" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Account Status
              </p>
              <Badge className="bg-linear-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 text-white px-4 py-2 shadow-md">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Active Profile
                </span>
              </Badge>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Profile Created
              </p>
              <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-semibold">{formatDate(talent.createdAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="dark:bg-slate-800 dark:border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-slate-100 flex items-center gap-2 text-xl">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="dark:text-slate-400 text-base">
              This action cannot be undone. This will permanently delete{' '}
              <strong className="text-slate-800 dark:text-slate-200">{talent.name}'s</strong> profile 
              and remove all associated data from the talent directory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="text-slate-900 dark:text-white bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 shadow-lg"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TalentDetails;