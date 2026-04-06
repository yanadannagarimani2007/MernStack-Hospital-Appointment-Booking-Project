export const HOSPITALS = [
    {
        id: 1,
        name: 'Apolo Hospital',
        location: 'Chennai',
        image: 'https://images.unsplash.com/photo-1538108149393-cebb47ac7924?w=800&q=80',
        tags: ['General', 'Dermatology', 'Cardiology', 'Neurology'],
        doctors: [
            { id: 301, name: 'Dr. Ram', specialty: 'General Physician', fee: 200 },
            { id: 302, name: 'Dr. Devi', specialty: 'Dermatologist', fee: 500 },
            { id: 303, name: 'Dr. Vijay', specialty: 'Cardiologist', fee: 700 },
            { id: 304, name: 'Dr. Priya', specialty: 'Neurologist', fee: 500 },
        ]
    },
    {
        id: 2,
        name: 'Skims Hospital',
        location: 'Tirupathi',
        image: 'https://images.unsplash.com/photo-1538108149393-cebb47ac7924?w=800&q=80',
        tags: ['General Physician', 'Dermatology', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'],
        doctors: [
            { id: 301, name: 'Dr. Venkatesh', specialty: 'General Physician', fee: 200 },
            { id: 302, name: 'Dr. Lakshmi', specialty: 'Dermatologist', fee: 500 },
            { id: 303, name: 'Dr. Harish', specialty: 'Cardiologist', fee: 700 },
            { id: 304, name: 'Dr. Lavanya', specialty: 'Neurologist', fee: 500 },
            { id: 305, name: 'Dr. Suresh', specialty: 'Orthopedics', fee: 400 },
            { id: 306, name: 'Dr. Kavya', specialty: 'Pediatrician', fee: 500 },
        ]
    }, {
        id: 3,
        name: 'Aditya Multispeciality Hospital',
        location: 'Kakinada',
        image: 'https://images.unsplash.com/photo-1538108149393-cebb47ac7924?w=800&q=80',
        tags: ['Psychology', 'General Physician', 'gynaecology', 'Neurology', 'Orthopedics'],
        doctors: [
            { id: 301, name: 'Dr. Vamsi', specialty: 'Psychologist', fee: 900 },
            { id: 302, name: 'Dr. Sravani', specialty: 'General Physician', fee: 300 },
            { id: 303, name: 'Dr. Swathi', specialty: 'gynaecologist', fee: 700 },
            { id: 304, name: 'Dr. Naveen', specialty: 'Neurologist', fee: 500 },
            { id: 305, name: 'Dr. Harsha vardhan', specialty: 'Orthopedics', fee: 400 },
            { id: 306, name: 'Dr. Sravya', specialty: 'Pediatrician', fee: 500 },
        ]
    },
    {
        id: 4,
        name: 'Sunshine Hospital',
        location: 'Vijayawada',
        image: 'https://images.unsplash.com/photo-1538108149393-cebb47ac7924?w=800&q=80',
        tags: ['General Physician', 'Dermatology', 'Cardiology', 'Neurology', 'gynaecology'],
        doctors: [
            { id: 301, name: 'Dr. Raghu', specialty: 'General Physician', fee: 300 },
            { id: 302, name: 'Dr. Sushmitha', specialty: 'Dermatologist', fee: 500 },
            { id: 303, name: 'Dr. Akhil', specialty: 'Cardiologist', fee: 800 },
            { id: 304, name: 'Dr. Rajkumar', specialty: 'Neurologist', fee: 400 },
            { id: 305, name: 'Dr. Priyadarshi', specialty: 'gynaecologist', fee: 600 },
        ]
    },
    {
        id: 5,
        name: 'City Central Hospital',
        location: 'Downtown, NY',
        image: 'https://images.unsplash.com/photo-1587351021759-3e566d6af7bf?w=800&q=80',
        tags: ['Cardiology', 'Neurology'],
        doctors: [
            { id: 101, name: 'Dr. Sarah Smith', specialty: 'Cardiologist', fee: 200 },
            { id: 102, name: 'Dr. John Doe', specialty: 'Neurologist', fee: 300 },
        ]
    },
    {
        id: 6,
        name: 'Westside Medical Center',
        location: 'Westside, LA',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
        tags: ['Orthopedics', 'Pediatrics'],
        doctors: [
            { id: 201, name: 'Dr. Emily Wong', specialty: 'Orthopedist', fee: 300 },
            { id: 202, name: 'Dr. James Lee', specialty: 'Pediatrician', fee: 400 },
        ]
    },
    {
        id: 7,
        name: 'North Point Health',
        location: 'Uptown, Chicago',
        image: 'https://images.unsplash.com/photo-1538108149393-cebb47ac7924?w=800&q=80',
        tags: ['General', 'Dermatology'],
        doctors: [
            { id: 301, name: 'Dr. Michael Brown', specialty: 'General Physician', fee: 200 },
            { id: 302, name: 'Dr. Anna Taylor', specialty: 'Dermatologist', fee: 500 },
        ]
    }
];

export interface Booking {
    id: string;
    hospitalId: number;
    hospitalName: string;
    doctorId: number;
    doctorName: string;
    doctorSpecialty: string;
    date: string;
    time: string;
    patientName: string;
    amountPaid?: number;
    status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Expired';
    userEmail?: string;
}
