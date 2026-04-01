<?php
/* ══════════════════════════════════════════
   EnvieInvestir — ticker.php
   Yahoo Finance v8/chart · cURL multi (parallèle)
   Tous les symboles fetchés simultanément → ~5s max
   Cache 5 min
   ══════════════════════════════════════════ */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: public, max-age=300');

define('CACHE_FILE', sys_get_temp_dir() . '/ei_v4.json');
define('CACHE_TTL',  300);
define('CURL_TIMEOUT', 10);

/* ── Cache valide → renvoie direct ── */
if (file_exists(CACHE_FILE) && (time() - filemtime(CACHE_FILE)) < CACHE_TTL) {
    echo file_get_contents(CACHE_FILE);
    exit;
}

/* ── Symboles ── */
$symbols = [
    '^GSPC'    => ['label' => 'S&P 500',    'currency' => 'USD', 'dec' => 0],
    'URTH'     => ['label' => 'MSCI World', 'currency' => 'USD', 'dec' => 2],
    '^IXIC'    => ['label' => 'Nasdaq',     'currency' => 'USD', 'dec' => 0],
    '^GDAXI'   => ['label' => 'DAX',        'currency' => 'EUR', 'dec' => 0],
    'BTC-USD'  => ['label' => 'Bitcoin',    'currency' => 'USD', 'dec' => 0],
    'GC=F'     => ['label' => 'Or',         'currency' => 'USD', 'dec' => 0],
    'EURUSD=X' => ['label' => 'EUR/USD',    'currency' => '',    'dec' => 4],
    'NVDA'     => ['label' => 'Nvidia',     'currency' => 'USD', 'dec' => 2],
    'AAPL'     => ['label' => 'Apple',      'currency' => 'USD', 'dec' => 2],
    'MSFT'     => ['label' => 'Microsoft',  'currency' => 'USD', 'dec' => 2],
    'AMZN'     => ['label' => 'Amazon',     'currency' => 'USD', 'dec' => 2],
    'META'     => ['label' => 'Meta',       'currency' => 'USD', 'dec' => 2],
];

/* ── Options cURL partagées ── */
function curlOpts(string $url): array {
    return [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => CURL_TIMEOUT,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_ENCODING       => '',
        CURLOPT_HTTPHEADER     => [
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept: application/json',
            'Referer: https://finance.yahoo.com/',
        ],
    ];
}

/* ── Parse réponse Yahoo v8/chart ── */
function parseChart(string $raw, array $conf): ?array {
    $json   = json_decode($raw, true);
    $result = $json['chart']['result'][0] ?? null;
    if (!$result) return null;

    $meta  = $result['meta'] ?? [];
    $price = (float)($meta['regularMarketPrice'] ?? $meta['price'] ?? 0);
    if ($price <= 0) return null;

    /* previousClose : plusieurs clés possibles */
    $prev = (float)($meta['previousClose']
        ?? $meta['chartPreviousClose']
        ?? $meta['regularMarketPreviousClose']
        ?? 0);

    /* Fallback : avant-dernier close de la série */
    if ($prev <= 0) {
        $closes = array_values(array_filter(
            $result['indicators']['quote'][0]['close'] ?? [],
            fn($v) => $v !== null
        ));
        if (count($closes) >= 2) $prev = (float)$closes[count($closes) - 2];
    }

    $change   = $prev > 0 ? round((($price - $prev) / $prev) * 100, 2) : 0.0;
    $diff     = round($price - $prev, 2);
    $currency = $meta['currency'] ?? $conf['currency'] ?? '';

    return [
        'label'    => $conf['label'],
        'price'    => round($price, $conf['dec']),
        'change'   => $change,
        'diff'     => $diff,
        'currency' => $currency,
        'up'       => $change >= 0,
        'prev'     => round($prev, $conf['dec']),
    ];
}

/* ══════════════════════════════════════════
   Fetch PARALLÈLE avec curl_multi
   Tous les symboles en même temps → ~5-8s max
   (au lieu de 13 × 7s = 91s en séquentiel)
   ══════════════════════════════════════════ */
function fetchAllParallel(array $symbols): array {
    if (!function_exists('curl_multi_init')) return [];

    $mh      = curl_multi_init();
    $handles = [];

    foreach (array_keys($symbols) as $sym) {
        $enc = rawurlencode($sym);
        $url = "https://query1.finance.yahoo.com/v8/finance/chart/{$enc}?interval=1d&range=5d&includePrePost=false";

        $ch = curl_init();
        curl_setopt_array($ch, curlOpts($url));
        curl_multi_add_handle($mh, $ch);
        $handles[$sym] = $ch;
    }

    /* Exécution parallèle */
    $active = 0;
    do {
        $status = curl_multi_exec($mh, $active);
        if ($active) curl_multi_select($mh, 1.0);
    } while ($active > 0 && $status === CURLM_OK);

    /* Collecte des résultats */
    $results = [];
    foreach ($handles as $sym => $ch) {
        $body = curl_multi_getcontent($ch);
        if ($body && strlen($body) > 20) {
            $results[$sym] = $body;
        }
        curl_multi_remove_handle($mh, $ch);
        curl_close($ch);
    }
    curl_multi_close($mh);

    return $results;
}

/* ── Build output ── */
$output = [
    'updated' => date('c'),
    'source'  => 'live',
    'data'    => [],
];

$raw = fetchAllParallel($symbols);

foreach ($symbols as $sym => $conf) {
    if (empty($raw[$sym])) continue;
    $parsed = parseChart($raw[$sym], $conf);
    if ($parsed) $output['data'][$sym] = $parsed;
}

/* ── Fallback si tout échoue ── */
if (empty($output['data'])) {
    $output['source'] = 'fallback';
    $output['data'] = [
        '^GSPC'    => ['label'=>'S&P 500',   'price'=>5612,  'change'=>0,'diff'=>0,'currency'=>'USD','up'=>true,'prev'=>5612],
        'URTH'     => ['label'=>'MSCI World','price'=>125.0, 'change'=>0,'diff'=>0,'currency'=>'USD','up'=>true,'prev'=>125.0],
        '^IXIC'    => ['label'=>'Nasdaq',    'price'=>17800, 'change'=>0,'diff'=>0,'currency'=>'USD','up'=>true,'prev'=>17800],
        'BTC-USD'  => ['label'=>'Bitcoin',   'price'=>85000, 'change'=>0,'diff'=>0,'currency'=>'USD','up'=>true,'prev'=>85000],
        'NVDA'     => ['label'=>'Nvidia',    'price'=>875.0, 'change'=>0,'diff'=>0,'currency'=>'USD','up'=>true,'prev'=>875.0],
        'AAPL'     => ['label'=>'Apple',     'price'=>195.0, 'change'=>0,'diff'=>0,'currency'=>'USD','up'=>true,'prev'=>195.0],
        'MSFT'     => ['label'=>'Microsoft', 'price'=>415.0, 'change'=>0,'diff'=>0,'currency'=>'USD','up'=>true,'prev'=>415.0],
        'AMZN'     => ['label'=>'Amazon',    'price'=>185.0, 'change'=>0,'diff'=>0,'currency'=>'USD','up'=>true,'prev'=>185.0],
        'META'     => ['label'=>'Meta',      'price'=>505.0, 'change'=>0,'diff'=>0,'currency'=>'USD','up'=>true,'prev'=>505.0],
        'GC=F'     => ['label'=>'Or',        'price'=>2300,  'change'=>0,'diff'=>0,'currency'=>'USD','up'=>true,'prev'=>2300],
        'EURUSD=X' => ['label'=>'EUR/USD',   'price'=>1.08,  'change'=>0,'diff'=>0,'currency'=>'' ,  'up'=>true,'prev'=>1.08],
    ];
}

$json = json_encode($output, JSON_UNESCAPED_UNICODE);
@file_put_contents(CACHE_FILE, $json);
echo $json;
