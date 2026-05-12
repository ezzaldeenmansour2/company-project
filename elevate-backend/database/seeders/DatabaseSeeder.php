<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Category;
use App\Models\Lesson;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create Categories
        $categories = ['البرمجة', 'التصميم', 'التسويق الرقمي', 'إدارة الأعمال'];
        foreach ($categories as $cat) {
            Category::create(['name' => $cat, 'slug' => \Illuminate\Support\Str::slug($cat)]);
        }

        // 2. Create Admin
        User::create([
            'name' => 'مدير النظام',
            'email' => 'admin@elevate.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // 3. Create Instructor
        $instructor = User::create([
            'name' => 'أحمد محمد',
            'email' => 'instructor@elevate.com',
            'password' => Hash::make('password'),
            'role' => 'instructor',
        ]);

        // 4. Create Student
        User::create([
            'name' => 'طالب تجريبي',
            'email' => 'student@elevate.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'device_uuid' => 'UUID-TEST-DEVICE',
        ]);

        // 5. Create Courses
        $course1 = Course::create([
            'instructor_id' => $instructor->id,
            'category_id' => 1,
            'title' => 'احترف تطوير واجهات المستخدم بـ React',
            'description' => 'دورة شاملة تبدأ معك من الصفر حتى الاحتراف في بناء تطبيقات الويب الحديثة.',
            'price' => 99.00,
            'thumbnail' => 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
            'level' => 'intermediate',
        ]);

        $course2 = Course::create([
            'instructor_id' => $instructor->id,
            'category_id' => 2,
            'title' => 'أساسيات تصميم الـ UI/UX',
            'description' => 'تعلم كيف تصمم واجهات مستخدم مذهلة وسهلة الاستخدام باستخدام Figma.',
            'price' => 49.00,
            'thumbnail' => 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&auto=format&fit=crop',
            'level' => 'beginner',
        ]);

        // 6. Create Lessons
        $lessons = [
            ['title' => 'مقدمة في React', 'content_type' => 'video', 'order' => 1],
            ['title' => 'فهم الـ Hooks', 'content_type' => 'video', 'order' => 2],
            ['title' => 'إدارة الحالة بـ Context API', 'content_type' => 'reading', 'order' => 3],
        ];

        foreach ($lessons as $lesson) {
            Lesson::create(array_merge($lesson, ['course_id' => $course1->id]));
        }
    }
}
