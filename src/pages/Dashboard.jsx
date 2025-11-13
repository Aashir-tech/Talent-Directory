
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchTalents } from '../redux/thunks/talentsThunks';
import { setFilter } from '../redux/slices/talentsSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, TrendingUp, Award, Eye, Plus, AlertCircle, Download, SlidersHorizontal } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { filteredTalents, loading, error, currentFilter, talents } = useSelector(
    (state) => state.talents
  );
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [expRange, setExpRange] = useState('all');

  useEffect(() => {
    dispatch(fetchTalents());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchInput(value);
    dispatch(setFilter(value));
  };

  const handleClearSearch = () => {
    setSearchInput('');
    dispatch(setFilter(''));
  };

  // Calculate statistics
  const totalTalents = talents.length;
  const avgExperience = talents.length > 0
    ? (talents.reduce((sum, t) => sum + t.experience, 0) / talents.length).toFixed(1)
    : 0;
  const allSkills = [...new Set(talents.flatMap((t) => t.skills))];
  const topSkills = allSkills.slice(0, 5);

  // Filter by experience range
  const filterByExperience = (talentsList) => {
    switch (expRange) {
      case '0-2':
        return talentsList.filter(t => t.experience >= 0 && t.experience <= 2);
      case '3-5':
        return talentsList.filter(t => t.experience >= 3 && t.experience <= 5);
      case '6-10':
        return talentsList.filter(t => t.experience >= 6 && t.experience <= 10);
      case '10+':
        return talentsList.filter(t => t.experience > 10);
      default:
        return talentsList;
    }
  };

  // Sort talents
  const sortTalents = (talentsList) => {
    const sorted = [...talentsList];
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'experience-high':
        return sorted.sort((a, b) => b.experience - a.experience);
      case 'experience-low':
        return sorted.sort((a, b) => a.experience - b.experience);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      default:
        return sorted;
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Skills', 'Experience', 'Date Added'];
    const rows = displayedTalents.map(t => [
      t.name,
      t.email,
      t.skills.join('; '),
      t.experience,
      new Date(t.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talents_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Apply all filters
  const displayedTalents = sortTalents(filterByExperience(filteredTalents));

  if (loading && talents.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="dark:bg-slate-800">
              <CardHeader>
                <Skeleton className="h-4 w-24 dark:bg-slate-700" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 dark:bg-slate-700" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold mb-2">Welcome to TalentHub</h1>
            <p className="text-blue-100 dark:text-blue-200 text-lg">
              Discover and manage your talent pool efficiently
            </p>
          </div>
          <Link to="/add-talent">
            <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-all">
              <Plus className="mr-2 h-5 w-5" />
              Add New Talent
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg dark:hover:shadow-slate-700/50 transition-shadow border-l-4 border-l-blue-500 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Total Talents
            </CardTitle>
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{totalTalents}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Active talent profiles</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg dark:hover:shadow-slate-700/50 transition-shadow border-l-4 border-l-indigo-500 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Avg Experience
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{avgExperience} yrs</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Average years of experience</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg dark:hover:shadow-slate-700/50 transition-shadow border-l-4 border-l-purple-500 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Unique Skills
            </CardTitle>
            <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100">{allSkills.length}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Different skill sets</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Card */}
      <Card className="shadow-md dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2 dark:text-slate-100">
                <SlidersHorizontal className="h-5 w-5" />
                <span>Search & Filters</span>
              </CardTitle>
              <CardDescription className="dark:text-slate-400">
                Filter and sort talents based on skills and experience
              </CardDescription>
            </div>
            {displayedTalents.length > 0 && (
              <Button variant="outline" onClick={exportToCSV} className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <Input
                type="text"
                placeholder="Search by skill..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400"
              />
            </div>
            {searchInput && (
              <Button variant="outline" onClick={handleClearSearch} className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                Clear
              </Button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Experience Range Filter */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Experience Range
              </label>
              <Select value={expRange} onValueChange={setExpRange}>
                <SelectTrigger className="bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
                  <SelectValue placeholder="All Experience Levels" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 dark:border-slate-700">
                  <SelectItem value="all" className="dark:text-slate-100 dark:focus:bg-slate-700">All Experience Levels</SelectItem>
                  <SelectItem value="0-2" className="dark:text-slate-100 dark:focus:bg-slate-700">0-2 years (Junior)</SelectItem>
                  <SelectItem value="3-5" className="dark:text-slate-100 dark:focus:bg-slate-700">3-5 years (Mid-level)</SelectItem>
                  <SelectItem value="6-10" className="dark:text-slate-100 dark:focus:bg-slate-700">6-10 years (Senior)</SelectItem>
                  <SelectItem value="10+" className="dark:text-slate-100 dark:focus:bg-slate-700">10+ years (Expert)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Sort By
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 dark:border-slate-700">
                  <SelectItem value="newest" className="dark:text-slate-100 dark:focus:bg-slate-700">Newest First</SelectItem>
                  <SelectItem value="oldest" className="dark:text-slate-100 dark:focus:bg-slate-700">Oldest First</SelectItem>
                  <SelectItem value="name" className="dark:text-slate-100 dark:focus:bg-slate-700">Name (A-Z)</SelectItem>
                  <SelectItem value="experience-high" className="dark:text-slate-100 dark:focus:bg-slate-700">Experience (High to Low)</SelectItem>
                  <SelectItem value="experience-low" className="dark:text-slate-100 dark:focus:bg-slate-700">Experience (Low to High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Popular Skills */}
          {topSkills.length > 0 && (
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Popular skills:</p>
              <div className="flex flex-wrap gap-2">
                {topSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="cursor-pointer hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition"
                    onClick={() => handleSearch(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Talents Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {currentFilter ? (
              <>
                Talents with <span className="text-blue-600 dark:text-blue-400">"{currentFilter}"</span>
              </>
            ) : (
              'All Talents'
            )}
          </h2>
          <Badge variant="outline" className="text-lg px-4 py-2 dark:border-slate-600 dark:text-slate-300">
            {displayedTalents.length} {displayedTalents.length === 1 ? 'Talent' : 'Talents'}
          </Badge>
        </div>

        {displayedTalents.length === 0 ? (
          <Card className="p-12 text-center dark:bg-slate-800 dark:border-slate-700">
            <Users className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {currentFilter || expRange !== 'all' ? 'No Matching Talents' : 'No Talents Yet'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {currentFilter || expRange !== 'all'
                ? 'No talents found matching your filters. Try adjusting your search.'
                : 'Start by adding your first talent to the directory.'}
            </p>
            {!currentFilter && expRange === 'all' && (
              <Link to="/add-talent">
                <Button className="text-slate-900 dark:text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Talent
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedTalents.map((talent) => (
              <TalentCard key={talent._id} talent={talent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Talent Card Component
const TalentCard = ({ talent }) => {
  const getExperienceLevel = (exp) => {
    if (exp <= 2) return { label: 'Junior', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
    if (exp <= 5) return { label: 'Mid-level', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
    if (exp <= 10) return { label: 'Senior', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' };
    return { label: 'Expert', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' };
  };

  const expLevel = getExperienceLevel(talent.experience);

  return (
    <Card className="group hover:shadow-xl dark:hover:shadow-slate-700/50 transition-all duration-300 border-2 hover:border-blue-500 dark:hover:border-blue-400 dark:bg-slate-800 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-slate-100">
              {talent.name}
            </CardTitle>
            <CardDescription className="text-sm dark:text-slate-400">{talent.email}</CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="dark:bg-slate-700 dark:text-slate-200">
            {talent.experience} yr{talent.experience !== 1 && 's'}
          </Badge>
          <Badge className={expLevel.color}>
            {expLevel.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Skills */}
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Skills:</p>
            <div className="flex flex-wrap gap-2">
              {talent.skills.slice(0, 4).map((skill, index) => (
                <Badge key={index} className="bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500">
                  {skill}
                </Badge>
              ))}
              {talent.skills.length > 4 && (
                <Badge variant="outline" className="dark:border-slate-600 dark:text-slate-300">
                  +{talent.skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <Link to={`/talent/${talent._id}`}>
            <Button variant="outline" className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;