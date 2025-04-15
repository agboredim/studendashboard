import { useSelector } from "react-redux";

function StudentPortalPage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-blue-950 mb-6">
          Student Portal
        </h1>

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-2">
            Welcome, {user?.username || "Student"}!
          </h2>
          <p className="text-gray-700">
            This is your personal student portal where you can access your
            courses, track your progress, and manage your account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow transition-shadow">
            <h3 className="text-lg font-semibold mb-2">My Courses</h3>
            <p className="text-gray-600 mb-4">
              Access your enrolled courses and continue your learning journey.
            </p>
            <button className="text-blue-950 font-medium hover:text-blue-800">
              View Courses →
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Progress Tracker</h3>
            <p className="text-gray-600 mb-4">
              Monitor your learning progress and achievements.
            </p>
            <button className="text-blue-950 font-medium hover:text-blue-800">
              View Progress →
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow transition-shadow">
            <h3 className="text-lg font-semibold mb-2">Account Settings</h3>
            <p className="text-gray-600 mb-4">
              Update your profile information and preferences.
            </p>
            <button className="text-blue-950 font-medium hover:text-blue-800">
              Manage Account →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentPortalPage;
