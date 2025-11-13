import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addTalent } from "../redux/thunks/talentsThunks";
import { clearMessages } from "../redux/slices/talentsSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  CheckCircle,
  X,
  AlertCircle,
  Sparkles,
  Award,
} from "lucide-react";

const AddTalent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector(
    (state) => state.talents
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "",
  });

  const [skillTags, setSkillTags] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
        navigate("/");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch, navigate]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (skillTags.length === 0) {
      errors.skills = "At least one skill is required";
    }

    if (!formData.experience) {
      errors.experience = "Experience is required";
    } else if (formData.experience < 0) {
      errors.experience = "Experience cannot be negative";
    } else if (formData.experience > 50) {
      errors.experience = "Experience cannot exceed 50 years";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const skill = skillInput.trim();
      if (skill && !skillTags.includes(skill)) {
        setSkillTags([...skillTags, skill]);
        setSkillInput("");
        if (formErrors.skills) {
          setFormErrors((prev) => ({ ...prev, skills: "" }));
        }
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillTags(skillTags.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const talentData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      skills: skillTags,
      experience: Number(formData.experience),
    };

    const result = await dispatch(addTalent(talentData));

    if (addTalent.fulfilled.match(result)) {
      setFormData({
        name: "",
        email: "",
        skills: "",
        experience: "",
      });
      setSkillTags([]);
      setSkillInput("");
      setFormErrors({});
    }
  };

  return (
    <div className="min-h-screen dark:bg-linear-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 bg-linear-to-br from-slate-50 via-white to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 dark:bg-blue-500/10 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 dark:bg-purple-500/10 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10">
          {/* Header with premium styling */}
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl dark:bg-linear-to-br dark:from-blue-500 dark:to-purple-600 bg-linear-to-br from-blue-600 to-purple-700 shadow-lg mb-4 animate-in zoom-in duration-500">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold dark:text-white mb-3 bg-clip-text text-transparent bg-linear-to-r dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 from-blue-600 via-purple-600 to-pink-600 animate-in slide-in-from-top duration-700">
              Add New Talent
            </h1>
            <p className="dark:text-slate-400 text-slate-600 text-lg font-medium max-w-2xl mx-auto animate-in slide-in-from-top duration-700 delay-100">
              Discover and onboard exceptional talent to build your dream team
            </p>
          </div>

          {/* Success Message with premium styling */}
          {successMessage && (
            <Alert className="mb-6 dark:bg-emerald-500/10 bg-emerald-50 dark:border-emerald-500/30 border-emerald-200 backdrop-blur-xl animate-in slide-in-from-top duration-500">
              <CheckCircle className="h-5 w-5 dark:text-emerald-400 text-emerald-600" />
              <AlertDescription className="dark:text-emerald-300 text-emerald-800 font-medium">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert className="mb-6 dark:bg-red-500/10 bg-red-50 dark:border-red-500/30 border-red-200 backdrop-blur-xl animate-in slide-in-from-top duration-500">
              <AlertCircle className="h-5 w-5 dark:text-red-400 text-red-600" />
              <AlertDescription className="dark:text-red-300 text-red-800 font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Premium Form Card with glassmorphism */}
          <Card className="dark:bg-slate-900/50 bg-white/80 backdrop-blur-2xl dark:border-slate-700/50 border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom duration-700 pt-0">
            {/* linear header with animated border */}
            <div className="relative">
              <div className="absolute inset-0 dark:bg-linear-to-r dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 opacity-90"></div>
              <div className="absolute inset-0 opacity-20"></div>

              <CardHeader className="relative py-8 px-8">
                <CardTitle className="flex items-center space-x-3 text-3xl text-white">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <span className="font-bold">Talent Information</span>
                </CardTitle>
                <CardDescription className="text-blue-100 text-base mt-2 font-medium">
                  Enter comprehensive details to create a standout profile
                </CardDescription>
              </CardHeader>
            </div>

            <CardContent className="pb-8 px-8">
              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Name Field */}
                <div className="space-y-2.5 group">
                  <Label
                    htmlFor="name"
                    className="text-base font-semibold dark:text-slate-200 text-slate-700 flex items-center gap-2"
                  >
                    Full Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`h-14 text-base dark:bg-slate-800/50 bg-slate-50 dark:border-slate-700 border-slate-300 dark:text-slate-100 text-slate-900 dark:placeholder:text-slate-500 placeholder:text-slate-400 transition-all duration-300 dark:focus:border-blue-500 focus:border-blue-600 dark:focus:ring-blue-500/20 focus:ring-blue-600/20 ${
                      formErrors.name
                        ? "dark:border-rose-500 border-rose-500 dark:focus:border-rose-500 focus:border-rose-500"
                        : ""
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-sm dark:text-rose-400 text-rose-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top duration-300">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2.5 group">
                  <Label
                    htmlFor="email"
                    className="text-base font-semibold dark:text-slate-200 text-slate-700 flex items-center gap-2"
                  >
                    Email Address <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`h-14 text-base dark:bg-slate-800/50 bg-slate-50 dark:border-slate-700 border-slate-300 dark:text-slate-100 text-slate-900 dark:placeholder:text-slate-500 placeholder:text-slate-400 transition-all duration-300 dark:focus:border-blue-500 focus:border-blue-600 dark:focus:ring-blue-500/20 focus:ring-blue-600/20 ${
                      formErrors.email
                        ? "dark:border-rose-500 border-rose-500 dark:focus:border-rose-500 focus:border-rose-500"
                        : ""
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-sm dark:text-rose-400 text-rose-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top duration-300">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Skills Field */}
                <div className="space-y-2.5 group">
                  <Label
                    htmlFor="skills"
                    className="text-base font-semibold dark:text-slate-200 text-slate-700 flex items-center gap-2"
                  >
                    Skills <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="skills"
                    name="skills"
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    placeholder="Type a skill and press Enter or comma"
                    className={`h-14 text-base dark:bg-slate-800/50 bg-slate-50 dark:border-slate-700 border-slate-300 dark:text-slate-100 text-slate-900 dark:placeholder:text-slate-500 placeholder:text-slate-400 transition-all duration-300 dark:focus:border-blue-500 focus:border-blue-600 dark:focus:ring-blue-500/20 focus:ring-blue-600/20 ${
                      formErrors.skills
                        ? "dark:border-rose-500 border-rose-500 dark:focus:border-rose-500 focus:border-rose-500"
                        : ""
                    }`}
                  />
                  <p className="text-sm dark:text-slate-500 text-slate-500 font-medium">
                    Press{" "}
                    <kbd className="px-2 py-0.5 text-xs font-semibold dark:bg-slate-800 bg-slate-200 dark:text-slate-300 text-slate-700 border dark:border-slate-700 border-slate-300 rounded">
                      Enter
                    </kbd>{" "}
                    or{" "}
                    <kbd className="px-2 py-0.5 text-xs font-semibold dark:bg-slate-800 bg-slate-200 dark:text-slate-300 text-slate-700 border dark:border-slate-700 border-slate-300 rounded">
                      ,
                    </kbd>{" "}
                    to add skills
                  </p>
                  {formErrors.skills && (
                    <p className="text-sm dark:text-rose-400 text-rose-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top duration-300">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.skills}
                    </p>
                  )}
                  {/* Premium Skill Tags */}
                  {skillTags.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 p-4 dark:bg-slate-800/30 bg-slate-100/50 rounded-xl dark:border dark:border-slate-700/50 border border-slate-200 backdrop-blur-sm animate-in slide-in-from-top duration-500">
                      {skillTags.map((skill, index) => (
                        <Badge
                          key={index}
                          className="px-4 py-2 text-sm font-semibold bg-linear-to-r dark:from-blue-500 dark:to-purple-600 from-blue-600 to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in zoom-in duration-300"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 hover:bg-white/30 rounded-full p-1 transition-all duration-200 hover:rotate-90"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Experience Field */}
                <div className="space-y-2.5 group">
                  <Label
                    htmlFor="experience"
                    className="text-base font-semibold dark:text-slate-200 text-slate-700 flex items-center gap-2"
                  >
                    Years of Experience <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="5"
                    min="0"
                    max="50"
                    className={`h-14 text-base dark:bg-slate-800/50 bg-slate-50 dark:border-slate-700 border-slate-300 dark:text-slate-100 text-slate-900 dark:placeholder:text-slate-500 placeholder:text-slate-400 transition-all duration-300 dark:focus:border-blue-500 focus:border-blue-600 dark:focus:ring-blue-500/20 focus:ring-blue-600/20 ${
                      formErrors.experience
                        ? "dark:border-rose-500 border-rose-500 dark:focus:border-rose-500 focus:border-rose-500"
                        : ""
                    }`}
                  />
                  {formErrors.experience && (
                    <p className="text-sm dark:text-rose-400 text-rose-600 flex items-center gap-1.5 font-medium animate-in slide-in-from-top duration-300">
                      <AlertCircle className="h-4 w-4" />
                      {formErrors.experience}
                    </p>
                  )}
                </div>

                {/* Premium Submit Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-14 text-base font-semibold bg-linear-to-r dark:from-blue-500 dark:to-purple-600 from-blue-600 to-purple-700 hover:from-blue-600 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-3"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Adding Talent...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Add Talent
                      </span>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                    disabled={loading}
                    className="h-14 px-8 text-base font-semibold dark:bg-slate-800/50 bg-white dark:border-slate-700 border-slate-300 dark:text-slate-200 text-slate-700 dark:hover:bg-slate-800 hover:bg-slate-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Premium footer hint */}
          <div className="text-center mt-8">
            <p className="dark:text-slate-500 text-slate-500 text-sm font-medium">
              All fields marked with <span className="text-rose-500">*</span>{" "}
              are required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTalent;
