<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckDeviceBinding
{
    /**
     * التحقق من أن الطلب صادر من الجهاز المرتبط بالحساب (للطلاب فقط).
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->role === 'student' && $user->device_uuid) {
            $requestDeviceId = $request->header('X-Device-UUID');

            if (!$requestDeviceId || $requestDeviceId !== $user->device_uuid) {
                return response()->json([
                    'message' => 'غير مسموح بالوصول من هذا الجهاز. الحساب مرتبط بجهاز آخر.',
                    'error_code' => 'UNAUTHORIZED_DEVICE'
                ], 403);
            }
        }

        return $next($request);
    }
}
