<?php
/* ══════════════════════════════════════════
   EnvieInvestir — api/debug.php
   À SUPPRIMER après diagnostic !
   Visite : ton-site.com/api/debug.php
   ══════════════════════════════════════════ */
header('Content-Type: text/plain; charset=utf-8');

echo "=== DIAGNOSTIC HOSTINGER ===\n\n";

/* PHP */
echo "PHP version    : " . PHP_VERSION . "\n";
echo "cURL dispo     : " . (function_exists('curl_init') ? "OUI ✓" : "NON ✗") . "\n";
echo "allow_url_fopen: " . (ini_get('allow_url_fopen') ? "OUI" : "NON") . "\n";
echo "sys_temp_dir   : " . sys_get_temp_dir() . "\n";
echo "Temp writable  : " . (is_writable(sys_get_temp_dir()) ? "OUI ✓" : "NON ✗") . "\n\n";

/* Test cURL vers Yahoo Finance */
echo "=== TEST cURL Yahoo Finance ===\n";
if (function_exists('curl_init')) {
    $ch = curl_init('https://query1.finance.yahoo.com/v7/finance/quote?symbols=%5EGSPC&fields=regularMarketPrice');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER     => ['User-Agent: Mozilla/5.0'],
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);

    echo "HTTP status : $code\n";
    echo "cURL error  : " . ($err ?: 'aucune') . "\n";

    if ($body) {
        $data = json_decode($body, true);
        $res  = $data['quoteResponse']['result'][0] ?? null;
        if ($res) {
            echo "S&P 500 prix: " . ($res['regularMarketPrice'] ?? '?') . "\n";
            echo "S&P 500 chg : " . ($res['regularMarketChangePercent'] ?? '?') . "%\n";
            echo "\n✅ Yahoo Finance fonctionne !\n";
        } else {
            echo "\n⚠️  Réponse reçue mais format inattendu :\n";
            echo substr($body, 0, 300) . "\n";
        }
    } else {
        echo "\n❌ Pas de réponse de Yahoo Finance\n";
    }
} else {
    echo "❌ cURL non disponible — contacte Hostinger\n";
}

echo "\n=== FIN DIAGNOSTIC ===\n";
echo "SUPPRIME CE FICHIER après lecture !\n";
