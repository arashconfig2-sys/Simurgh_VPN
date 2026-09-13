export interface UnityScript {
  id: string;
  filename: string;
  title: string;
  description: string;
  code: string;
}

export const unityScripts: UnityScript[] = [
  {
    id: 'mainMenu',
    filename: 'MainMenuManager.cs',
    title: 'کد ۱: مدیریت منوها و تنظیمات (MainMenuManager.cs)',
    description: 'مدیریت منوی اصلی، انتخاب درجه سختی (Easy/Medium/Hard)، تنظیمات گرافیک، تغییر زبان و منوی درباره ما به نام Arash Nj.',
    code: `using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class MainMenuManager : MonoBehaviour
{
    [Header("Panels")]
    public GameObject difficultyPanel;
    public GameObject settingsPanel;
    public GameObject aboutPanel;

    [Header("Developer Info")]
    public string developerName = "Arash Nj";

    void Start()
    {
        // زبان پیش‌فرض انگلیسی
        if (!PlayerPrefs.HasKey("Language"))
        {
            PlayerPrefs.SetString("Language", "English");
        }
        
        difficultyPanel.SetActive(false);
        settingsPanel.SetActive(false);
        aboutPanel.SetActive(false);
    }

    // دکمه شروع
    public void OnStartButtonClicked()
    {
        difficultyPanel.SetActive(true);
    }

    // انتخاب درجه سختی و ورود به بازی
    public void SelectDifficulty(string level)
    {
        PlayerPrefs.SetString("Difficulty", level);
        SceneManager.LoadScene("GameScene"); // نام صحنه اصلی بازی
    }

    // تنظیمات گرافیک
    public void SetGraphicsQuality(int qualityIndex)
    {
        QualitySettings.SetQualityLevel(qualityIndex);
    }

    // تغییر زبان
    public void SetLanguage(string lang)
    {
        PlayerPrefs.SetString("Language", lang);
        // فراخوانی سیستم ترجمه
    }

    // باز کردن صفحات
    public void OpenSettings() => settingsPanel.SetActive(true);
    public void CloseSettings() => settingsPanel.SetActive(false);
    
    public void OpenAbout() => aboutPanel.SetActive(true);
    public void CloseAbout() => aboutPanel.SetActive(false);

    public void ExitGame() => Application.Quit();
}`
  },
  {
    id: 'playerController',
    filename: 'PlayerController.cs',
    title: 'کد ۲: کنترل سفینه بازیکن برای اندروید (PlayerController.cs)',
    description: 'حرکت هموار سفینه با لمس انگشت در اندروید (Touch & Drag) و شلیک خودکار لیزرها به همراه دریافت پاورآپ‌ها.',
    code: `using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float speed = 10f;
    public GameObject bulletPrefab;
    public Transform firePoint;
    public float fireRate = 0.2f;

    private float nextFire = 0f;
    private Vector3 touchPosition;
    private Rigidbody2D rb;

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        // کنترل لمسی اندروید
        if (Input.touchCount > 0)
        {
            Touch touch = Input.GetTouch(0);
            touchPosition = Camera.main.ScreenToWorldPoint(touch.position);
            touchPosition.z = 0f;

            // حرکت هموار سفینه به سمت انگشت
            transform.position = Vector3.MoveTowards(transform.position, touchPosition, speed * Time.deltaTime);

            // شلیک خودکار هنگام لمس
            if (Time.time > nextFire)
            {
                nextFire = Time.time + fireRate;
                Shoot();
            }
        }
    }

    void Shoot()
    {
        Instantiate(bulletPrefab, firePoint.position, Quaternion.identity);
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.CompareTag("Alien") || collision.CompareTag("AlienBullet"))
        {
            // کم شدن جان یا باخت
            GameManager.instance.PlayerDied();
        }
    }
}`
  },
  {
    id: 'gameManager',
    filename: 'GameManager.cs',
    title: 'کد ۳: مدیریت مراحل و ۲۰ مرحله بازی (GameManager.cs)',
    description: 'کنترل کننده اصلی مراحل بازی، مدیریت ۲۰ مرحله، غول‌های مراحل ۵، ۱۰ و ۲۰ و نمایش نام سازنده Arash Nj.',
    code: `using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class GameManager : MonoBehaviour
{
    public static GameManager instance;

    public int currentLevel = 1;
    public int maxLevels = 20;
    public Text levelText;
    public Text developerText;

    private string difficulty;

    void Awake()
    {
        if (instance == null) instance = this;
        else Destroy(gameObject);
    }

    void Start()
    {
        difficulty = PlayerPrefs.GetString("Difficulty", "Medium");
        developerText.text = "Created by: Arash Nj";
        UpdateUI();
        StartLevel(currentLevel);
    }

    public void StartLevel(int level)
    {
        Debug.Log("Starting Level: " + level + " on " + difficulty + " mode.");
        // کد اسپان شدن آدم فضایی‌ها بر اساس شماره مرحله
    }

    public void LevelCompleted()
    {
        if (currentLevel < maxLevels)
        {
            currentLevel++;
            UpdateUI();
            StartLevel(currentLevel);
        }
        else
        {
            // پایان بازی و نجات زمین!
            Debug.Log("Congratulations! Earth is Saved by Arash Nj's hero!");
        }
    }

    public void PlayerDied()
    {
        // نمایش صفحه Game Over
        SceneManager.LoadScene(SceneManager.GetActiveScene().name);
    }

    void UpdateUI()
    {
        levelText.text = "Level: " + currentLevel + " / 20";
    }
}`
  },
  {
    id: 'alienEnemy',
    filename: 'AlienEnemy.cs',
    title: 'کد تکمیلی: رفتارهای دشمنان فضایی (AlienEnemy.cs)',
    description: 'هوش مصنوعی حرکتی متجاوزان فضایی، شلیک گلوله به سمت بازیکن و شانس ریزش پاورآپ هنگام انهدام.',
    code: `using UnityEngine;

public class AlienEnemy : MonoBehaviour
{
    public float health = 10f;
    public int scoreValue = 100;
    public GameObject bulletPrefab;
    public GameObject[] powerUpPrefabs;
    [Range(0, 100)] public float powerUpDropChance = 25f;

    void Start()
    {
        InvokeRepeating("AttemptShoot", Random.Range(1f, 3f), Random.Range(2f, 4f));
    }

    void AttemptShoot()
    {
        if (bulletPrefab != null)
        {
            Instantiate(bulletPrefab, transform.position, Quaternion.identity);
        }
    }

    public void TakeDamage(float amount)
    {
        health -= amount;
        if (health <= 0)
        {
            Die();
        }
    }

    void Die()
    {
        // شانس ریزش پاورآپ
        if (Random.Range(0f, 100f) <= powerUpDropChance && powerUpPrefabs.Length > 0)
        {
            int randomIndex = Random.Range(0, powerUpPrefabs.Length);
            Instantiate(powerUpPrefabs[randomIndex], transform.position, Quaternion.identity);
        }

        Destroy(gameObject);
    }
}`
  }
];
