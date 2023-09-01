<?php

namespace App\Entity;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;

use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Delete;
use Doctrine\ORM\Mapping as ORM;
use App\State\GetMeStateProvider;
use APP\Entity\Post as PostEntity;
use App\Repository\UserRepository;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post AS MetaDataPost;
use ApiPlatform\Symfony\Messenger\Processor;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping\LifecycleCallbacks;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Rollerworks\Component\PasswordStrength\Validator\Constraints as RollerworksPassword;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['read']],
    denormalizationContext: ['groups' => ['write']],
)]
#[GetCollection(
    security: "is_granted('ROLE_ADMIN')",
    normalizationContext: ['groups' => ['UsersCollection']],//normalizationcontext pour recevoir (read) une requet
)]
#[Get(
    security: "is_granted('ROLE_ADMIN')", 
    normalizationContext: ['groups' => ['UsersCollection']],
)]
#[MetaDataPost(
     security: "is_granted('PUBLIC_ACCESS')",
      denormalizationContext: ['groups' => ['AddUsers']],//dormalizationcontext pour envoyer (write) une requet
     
)]
#[Get(
    name:'get_me',
    uriTemplate:'/users-me',
    provider:GetMeStateProvider::class,
    normalizationContext: ['groups' => ['Me']],

)]
#[Put(
    security: "is_granted('ROLE_ADMIN')", 
    denormalizationContext: ['groups' => ['AddUsers']],
)]
#[Patch(
    security: "is_granted('ROLE_ADMIN')", 
    denormalizationContext: ['groups' => ['AddUsers']],
)]
#[Delete(
    security: "is_granted('ROLE_ADMIN')",
    denormalizationContext: ['groups' => ['AddUsers']], 
)]
#[ORM\HasLifecycleCallbacks()]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['UsersCollection','Me','AddUsers'])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['UsersCollection','Me','AddUsers'])]
    private ?string $email = null;


    #[ORM\Column]
    #[Groups(['UsersCollection','Me','AddUsers'])]
    private array $roles = [];

    

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Groups(['Me','AddUsers'])]
    /**
    * @RollerworksPassword\PasswordRequirements(requireLetters=true, requireNumbers=true, requireCaseDiff=true)
    */
    private ?string $password = null;
    

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Comment::class, orphanRemoval: true)]
    #[Groups(['UsersCollection','Me','AddUsers'])]
    private Collection $comments;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: Post::class, orphanRemoval: true)]
    #[Groups(['UsersCollection','Me','AddUsers'])]
    private Collection $posts;

    #[ORM\Column(length: 255)]
    #[Groups(['UsersCollection','Me','AddUsers'])]
    private ?string $name = null;

    public function __construct()
    {
        $this->comments = new ArrayCollection();
        $this->posts = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this User.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every User at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }
    
    #[ORM\PrePersist()]
    public function prePersist(): void
    {
        if ($this->password) {
            $this->password = password_hash($this->password, PASSWORD_BCRYPT);
        }
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the User, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, Comment>
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComment(Comment $comment): self
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setUser($this);
        }

        return $this;
    }

    public function removeComment(Comment $comment): self
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getUser() === $this) {
                $comment->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Post>
     */
    public function getPosts(): Collection
    {
        return $this->posts;
    }

    public function addPost(PostEntity $post): self
    {
        if (!$this->posts->contains($post)) {
            $this->posts->add($post);
            $post->setUser($this);
        }

        return $this;
    }

    public function removePost(PostEntity $post): self
    {
        if ($this->posts->removeElement($post)) {
            // set the owning side to null (unless already changed)
            if ($post->getUser() === $this) {
                $post->setUser(null);
            }
        }

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }
}
