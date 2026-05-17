<?php

namespace App\Http\Controllers;

use App\Models\PromoAd;
use App\Models\Discount;
use Illuminate\Http\Request;

class MarketingController extends Controller
{
    /**
     * Get all active promo ads
     */
    public function getActiveAds()
    {
        $ads = PromoAd::where('is_active', true)->get();
        return response()->json($ads);
    }

    /**
     * Store a new promo ad
     */
    public function storeAd(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|max:5120', // Increased to 5MB
            'link' => 'nullable|url'
        ]);

        $path = $request->file('image')->store('promo_ads', 'public');

        $ad = PromoAd::create([
            'title' => $request->title,
            'image_path' => $path,
            'link' => $request->link,
            'is_active' => true
        ]);

        return response()->json([
            'message' => 'تمت إضافة الإعلان بنجاح',
            'ad' => $ad
        ], 201);
    }

    /**
     * Store a new discount
     */
    public function storeDiscount(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'user_id' => 'nullable|exists:users,id',
            'percentage' => 'required|numeric|min:1|max:100',
            'starts_at' => 'nullable|date',
            'ends_at' => 'nullable|date|after_or_equal:starts_at'
        ]);

        $discount = Discount::create($request->all());

        return response()->json([
            'message' => 'تم إنشاء الخصم بنجاح',
            'discount' => $discount
        ], 201);
    }
}
