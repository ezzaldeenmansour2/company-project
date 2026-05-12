<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'برمجة وتطوير', 'description' => 'دورات في علوم الحاسوب والبرمجة'],
            ['name' => 'تصميم وجرافيك', 'description' => 'دورات في التصميم الجرافيكي وتجربة المستخدم'],
            ['name' => 'تسويق رقمي', 'description' => 'دورات التسويق عبر الإنترنت'],
            ['name' => 'إدارة أعمال', 'description' => 'القيادة وإدارة المشاريع'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['name' => $cat['name']], $cat);
        }
    }
}
