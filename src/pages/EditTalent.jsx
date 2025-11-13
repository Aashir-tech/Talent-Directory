import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateTalent } from "../redux/thunks/talentsThunks";
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
import { UserPlus, CheckCircle, X, AlertCircle, ArrowLeft } from "lucide-react";

const EditTalent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { talents, loading, error, successMessage } = useSelector(
    (state) => state.talents
  );

  const talent = talents.find((t) => t._id === id);

  // Initialize form with existing data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    experience: "",
  });

  const [skillTags, setSkillTags] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (talent) {
      setFormData({
        name: talent.name,
        email: talent.email,
        experience: talent.experience,
      });
      setSkillTags(talent.skills);
    }
  }, [talent]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
        navigate(`/talent/${id}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, dispatch, navigate, id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Add skill on Enter or comma
  const handleAddSkill = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const skill = skillInput.trim();

      if (skill && !skillTags.includes(skill)) {
        setSkillTags((prev) => [...prev, skill]);
        setSkillInput("");
        // Clear skills error when a skill is added
        if (formErrors.skills) {
          setFormErrors((prev) => ({ ...prev, skills: "" }));
        }
      }
    }
  };

  // Remove skill
  const handleRemoveSkill = (skillToRemove) => {
    setSkillTags((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
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

    await dispatch(updateTalent({ id, talentData }));
  };

  if (!talent && !loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">Talent not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(`/talent/${id}`)}
        className="mb-6 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Talent Details
      </Button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Edit Talent
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Update the details for {talent?.name || "this talent"}
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-300">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert
          variant="destructive"
          className="mb-6 dark:bg-red-900/20 dark:border-red-800"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="dark:text-red-400">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Form Card */}
      <Card className="shadow-xl dark:shadow-slate-900/50 dark:bg-slate-800 dark:border-slate-700 pt-0">
        <CardHeader className=" py-6 bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white rounded-t-lg">
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <UserPlus className="h-6 w-6" />
            <span>Talent Information</span>
          </CardTitle>
          <CardDescription className="text-blue-100 dark:text-blue-200">
            Please provide accurate information about the talent
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6 px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-base font-semibold dark:text-slate-200"
              >
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`h-12 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400 ${
                  formErrors.name ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              {formErrors.name && (
                <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-base font-semibold dark:text-slate-200"
              >
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={`h-12 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400 ${
                  formErrors.email ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              {formErrors.email && (
                <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Skills Field */}
            <div className="space-y-2">
              <Label
                htmlFor="skills"
                className="text-base font-semibold dark:text-slate-200"
              >
                Skills <span className="text-red-500">*</span>
              </Label>
              <Input
                id="skills"
                name="skills"
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Type a skill and press Enter or comma"
                className={`h-12 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400 ${
                  formErrors.skills ? "border-red-500 dark:border-red-500" : ""
                }`}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Press Enter or comma (,) to add multiple skills
              </p>
              {formErrors.skills && (
                <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.skills}
                </p>
              )}
              {/* Skill Tags */}
              {skillTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  {skillTags.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 pl-3 pr-1 py-1 flex items-center gap-1 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Experience Field */}
            <div className="space-y-2">
              <Label
                htmlFor="experience"
                className="text-base font-semibold dark:text-slate-200"
              >
                Years of Experience <span className="text-red-500">*</span>
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
                className={`h-12 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100 dark:placeholder-slate-400 ${
                  formErrors.experience
                    ? "border-red-500 dark:border-red-500"
                    : ""
                }`}
              />
              {formErrors.experience && (
                <p className="text-sm text-red-500 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {formErrors.experience}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
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
                    Updating Talent...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Update Talent
                  </span>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/talent/${id}`)}
                disabled={loading}
                className="h-12 px-8 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTalent;
