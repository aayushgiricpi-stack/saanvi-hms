import DashboardLayout from "../../layouts/DashboardLayout";

function Doctors() {
    const createDoctor = async () => {
        try {
            const token =
                localStorage.getItem("token");

            await axios.post(
                "http://localhost:5000/api/admin/doctors",
                doctorForm,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                "Doctor Added Successfully"
            );

            setDoctorForm({
                fullname: "",
                email: "",
                phone: "",
                password: "",
            });

            fetchUsers();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed To Add Doctor"
            );
        }
    };

    const deleteDoctor = async (id) => {
        if (
            !window.confirm(
                "Delete this doctor?"
            )
        )
            return;

        try {
            const token =
                localStorage.getItem("token");

            await axios.delete(
                `http://localhost:5000/api/admin/doctors/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                "Doctor Deleted Successfully"
            );

            fetchUsers();
        } catch (error) {
            toast.error(
                "Failed To Delete Doctor"
            );
        }
    };
    const editDoctor = (doctor) => {
        setEditingDoctorId(
            doctor.id
        );

        setDoctorForm({
            fullname:
                doctor.fullname,
            email: doctor.email,
            phone: doctor.phone,
            password: "",
        });
    };
    const updateDoctor = async () => {
        try {
            const token =
                localStorage.getItem("token");

            await axios.put(
                `http://localhost:5000/api/admin/doctors/${editingDoctorId}`,
                {
                    fullname:
                        doctorForm.fullname,
                    email:
                        doctorForm.email,
                    phone:
                        doctorForm.phone,
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            toast.success(
                "Doctor Updated Successfully"
            );

            setEditingDoctorId(null);

            setDoctorForm({
                fullname: "",
                email: "",
                phone: "",
                password: "",
            });

            fetchUsers();
        } catch (error) {
            console.log(error);

            toast.error(
                "Failed To Update Doctor"
            );
        }
    };

    return (

        <DashboardLayout role="Admin">

            <div className="container-fluid">

                <div className="card shadow">

                    <div className="card-header bg-success text-white">

                        <h3>👨‍⚕️ Manage Doctors</h3>

                    </div>

                    <div className="card shadow border-0 mb-4">

                        <div className="card-header bg-success text-white">
                            <h4 className="mb-0">
                                {editingDoctorId
                                    ? "✏️ Update Doctor"
                                    : "➕ Add Doctor"}
                            </h4>
                        </div>

                        <div className="card-body">

                            <div className="row g-2">

                                <div className="col-md-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Full Name"
                                        value={
                                            doctorForm.fullname
                                        }
                                        onChange={(e) =>
                                            setDoctorForm({
                                                ...doctorForm,
                                                fullname:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-3">
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Email"
                                        value={
                                            doctorForm.email
                                        }
                                        onChange={(e) =>
                                            setDoctorForm({
                                                ...doctorForm,
                                                email:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Phone"
                                        value={
                                            doctorForm.phone
                                        }
                                        onChange={(e) =>
                                            setDoctorForm({
                                                ...doctorForm,
                                                phone:
                                                    e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <select
                                        className="form-control"
                                        value={doctorForm.department}
                                        onChange={(e) =>
                                            setDoctorForm({
                                                ...doctorForm,
                                                department: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">
                                            Select Department
                                        </option>

                                        <option value="Cardiology">
                                            Cardiology
                                        </option>

                                        <option value="Neurology">
                                            Neurology
                                        </option>

                                        <option value="Orthopedics">
                                            Orthopedics
                                        </option>

                                        <option value="Pediatrics">
                                            Pediatrics
                                        </option>

                                        <option value="ENT">
                                            ENT
                                        </option>

                                        <option value="General">
                                            General
                                        </option>
                                    </select>
                                </div>

                                <div className="col-md-2">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Password"
                                        value={doctorForm.password}
                                        onChange={(e) =>
                                            setDoctorForm({
                                                ...doctorForm,
                                                password: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div className="col-md-2">

                                    <button
                                        className={`btn w-100 ${editingDoctorId
                                            ? "btn-warning"
                                            : "btn-success"
                                            }`}
                                        onClick={
                                            editingDoctorId
                                                ? updateDoctor
                                                : createDoctor
                                        }
                                    >
                                        {editingDoctorId
                                            ? "Update Doctor"
                                            : "Add Doctor"}
                                    </button>

                                    {editingDoctorId && (
                                        <button
                                            className="btn btn-secondary w-100 mt-2"
                                            onClick={() => {
                                                setEditingDoctorId(null);

                                                setDoctorForm({
                                                    fullname: "",
                                                    email: "",
                                                    phone: "",
                                                    password: "",
                                                    department: "",
                                                });
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default Doctors;