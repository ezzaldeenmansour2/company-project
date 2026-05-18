<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            width: 297mm;
            height: 210mm;
            background: #0a0f1e;
            font-family: 'Tajawal', 'Arial', sans-serif;
            overflow: hidden;
            position: relative;
        }

        /* Background decorative circles */
        .bg-circle-1 {
            position: absolute;
            top: -80px;
            right: -80px;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%);
            border-radius: 50%;
        }
        .bg-circle-2 {
            position: absolute;
            bottom: -60px;
            left: -60px;
            width: 250px;
            height: 250px;
            background: radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%);
            border-radius: 50%;
        }
        .bg-circle-3 {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%);
            border-radius: 50%;
        }

        /* Gold corner decorations */
        .corner {
            position: absolute;
            width: 80px;
            height: 80px;
            border-color: #c8a95a;
            border-style: solid;
            opacity: 0.8;
        }
        .corner-tl { top: 20px; right: 20px; border-width: 3px 0 0 3px; }
        .corner-tr { top: 20px; left: 20px; border-width: 3px 3px 0 0; }
        .corner-bl { bottom: 20px; right: 20px; border-width: 0 0 3px 3px; }
        .corner-br { bottom: 20px; left: 20px; border-width: 0 3px 3px 0; }

        /* Main content container */
        .container {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 60px;
            text-align: center;
        }

        /* Header - Logo & Platform name */
        .platform-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 12px;
        }
        .logo-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            font-weight: 900;
            color: white;
        }
        .platform-name {
            font-size: 28px;
            font-weight: 900;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: 3px;
        }

        /* Gold divider */
        .divider {
            width: 120px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #c8a95a, transparent);
            margin: 10px auto;
        }

        /* Certificate of completion */
        .cert-label {
            font-size: 13px;
            letter-spacing: 5px;
            color: #c8a95a;
            text-transform: uppercase;
            margin-bottom: 12px;
            font-weight: 700;
        }

        /* Main title */
        .cert-title {
            font-size: 42px;
            font-weight: 900;
            color: #ffffff;
            letter-spacing: 2px;
            margin-bottom: 6px;
            line-height: 1.1;
        }

        /* Subtitle */
        .cert-subtitle {
            font-size: 13px;
            color: #94a3b8;
            letter-spacing: 2px;
            margin-bottom: 20px;
        }

        /* Awarded to */
        .awarded-to {
            font-size: 12px;
            color: #64748b;
            letter-spacing: 3px;
            margin-bottom: 6px;
        }

        /* Student name */
        .student-name {
            font-size: 38px;
            font-weight: 900;
            color: #c8a95a;
            margin-bottom: 8px;
            text-shadow: 0 0 30px rgba(200,169,90,0.4);
        }

        /* Course completion text */
        .completion-text {
            font-size: 13px;
            color: #94a3b8;
            margin-bottom: 8px;
            line-height: 1.6;
        }

        /* Course name */
        .course-name {
            font-size: 20px;
            font-weight: 900;
            color: #a5b4fc;
            margin-bottom: 20px;
            padding: 8px 24px;
            border: 1px solid rgba(99,102,241,0.3);
            border-radius: 8px;
            background: rgba(99,102,241,0.08);
            display: inline-block;
        }

        /* Bottom row - date, signature, hash */
        .bottom-row {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            width: 100%;
            margin-top: 16px;
            gap: 20px;
        }

        .info-block {
            flex: 1;
            text-align: center;
        }

        .info-label {
            font-size: 9px;
            letter-spacing: 2px;
            color: #475569;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .info-value {
            font-size: 13px;
            font-weight: 700;
            color: #e2e8f0;
        }

        .info-value.hash {
            font-family: 'Courier New', monospace;
            font-size: 11px;
            color: #c8a95a;
            background: rgba(200,169,90,0.08);
            padding: 4px 8px;
            border-radius: 4px;
            border: 1px solid rgba(200,169,90,0.2);
        }

        /* Vertical dividers between bottom blocks */
        .v-divider {
            width: 1px;
            height: 40px;
            background: linear-gradient(180deg, transparent, #334155, transparent);
        }

        /* Verified badge */
        .verified-badge {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background: rgba(16,185,129,0.1);
            border: 1px solid rgba(16,185,129,0.3);
            color: #10b981;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 2px;
            padding: 5px 14px;
            border-radius: 20px;
            margin-top: 10px;
        }

        /* Star decorations */
        .stars {
            color: #c8a95a;
            font-size: 14px;
            letter-spacing: 8px;
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <!-- Background decorations -->
    <div class="bg-circle-1"></div>
    <div class="bg-circle-2"></div>
    <div class="bg-circle-3"></div>

    <!-- Corner decorations -->
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <!-- Main content -->
    <div class="container">
        <!-- Platform header -->
        <div class="platform-logo">
            <div class="logo-icon">E</div>
            <div class="platform-name">ELEVATE</div>
        </div>

        <div class="divider"></div>

        <div class="cert-label">&#9733; شهادة إتمام رسمية &#9733;</div>
        <div class="cert-title">CERTIFICATE OF COMPLETION</div>
        <div class="cert-subtitle">هذه الشهادة ممنوحة تقديراً للجهود المبذولة</div>

        <div class="divider" style="width:60px; margin-bottom:16px;"></div>

        <div class="stars">&#9733; &#9733; &#9733;</div>
        <div class="awarded-to">M A N H O O C H A</div>
        <div class="student-name">{{ $studentName }}</div>

        <div class="completion-text">
            لإتمامه بنجاح دورة تدريبية كاملة عبر منصة Elevate التعليمية
        </div>

        <div class="course-name">{{ $courseTitle }}</div>

        <!-- Bottom row -->
        <div class="bottom-row">
            <div class="info-block">
                <div class="info-label">Date of Issue</div>
                <div class="info-value">{{ $issuedAt }}</div>
            </div>
            <div class="v-divider"></div>
            <div class="info-block">
                <div class="info-label">Instructor</div>
                <div class="info-value">{{ $instructorName }}</div>
            </div>
            <div class="v-divider"></div>
            <div class="info-block">
                <div class="info-label">Certificate ID</div>
                <div class="info-value hash">{{ $certificateHash }}</div>
            </div>
        </div>

        <!-- Verified badge -->
        <div class="verified-badge">
            &#10003; &nbsp; VERIFIED &nbsp; · &nbsp; يمكن التحقق من صحة هذه الشهادة عبر المنصة
        </div>
    </div>
</body>
</html>
