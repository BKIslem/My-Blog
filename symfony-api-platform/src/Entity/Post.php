<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post as MetadataPost;
use ApiPlatform\Metadata\Put;
use App\Repository\PostRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PostRepository::class)]
#[ApiResource(
    security: "is_granted('ROLE_USER')",
    normalizationContext: ['groups' => ['read']],
    denormalizationContext: ['groups' => ['write']],
)]
#[GetCollection(
    security: "is_granted('PUBLIC_ACCESS')",
    normalizationContext: ['groups' => ['PostCollection']],//normalizationcontext pour recevoir (read) une requet
)]
#[Get(
    security: "is_granted('PUBLIC_ACCESS')",
    normalizationContext: ['groups' => ['PostCollection']],
)]
#[MetadataPost(
    security: "is_granted('ROLE_ADMIN')",
    denormalizationContext: ['groups' => ['AddPost']],//dormalizationcontext pour envoyer (write) une requet
     
)]
#[Put(
    security: "is_granted('ROLE_ADMIN')", 
    denormalizationContext: ['groups' => ['AddPost']],
)]
#[Patch(
    security: "is_granted('ROLE_ADMIN')", 
    denormalizationContext: ['groups' => ['AddPost']],
)]
#[Delete(
    security: "is_granted('ROLE_ADMIN')",
    denormalizationContext: ['groups' => ['AddPost']], 
)]
class Post
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['PostCollection','AddPost'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'posts')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['PostCollection','AddPost'])]
    private ?User $user = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['PostCollection','AddPost'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['PostCollection','AddPost'])]
    private ?string $body = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['PostCollection','AddPost'])]
    private ?\DateTimeImmutable $published_at = null;

    #[ORM\OneToMany(mappedBy: 'post', targetEntity: comment::class)]
    #[Groups(['PostCollection','AddPost'])]
    private Collection $comment;

    public function __construct()
    {
        $this->comment = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getBody(): ?string
    {
        return $this->body;
    }

    public function setBody(?string $body): self
    {
        $this->body = $body;

        return $this;
    }

    public function getPublishedAt(): ?\DateTimeImmutable
    {
        return $this->published_at;
    }

    public function setPublishedAt(?\DateTimeImmutable $published_at): self
    {
        $this->published_at = $published_at;

        return $this;
    }

    /**
     * @return Collection<int, comment>
     */
    public function getComment(): Collection
    {
        return $this->comment;
    }

    public function addComment(comment $comment): self
    {
        if (!$this->comment->contains($comment)) {
            $this->comment->add($comment);
            $comment->setPost($this);
        }

        return $this;
    }

    public function removeComment(comment $comment): self
    {
        if ($this->comment->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getPost() === $this) {
                $comment->setPost(null);
            }
        }

        return $this;
    }
}
